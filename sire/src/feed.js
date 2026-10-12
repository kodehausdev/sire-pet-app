import { supabase } from './lib/supabase.js';

export const live = !!supabase;

const VOTES_KEY = 'sire-votes';
const LAST_POST_KEY = 'sire-last-post';
const POST_GAP_MS = 30000;
const POST_COLS = 'id, question, body, tag, helpful, created_at';

/* ---------- small helpers ---------- */
export function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return mins + 'm';
  if (mins < 1440) return Math.floor(mins / 60) + 'h';
  return Math.floor(mins / 1440) + 'd';
}

const toPost = (r) => ({
  id: r.id, q: r.question, body: r.body, tag: r.tag, helpful: r.helpful,
  time: timeAgo(r.created_at), replies: r.replies?.[0]?.count ?? 0, who: '',
});
const toReply = (r) => ({ id: r.id, body: r.body, time: timeAgo(r.created_at) });
const fail = (msg) => { throw new Error(msg); };

// which posts this device already marked helpful (so you can't stack votes)
export function getMyVotes() {
  try { return new Set(JSON.parse(localStorage.getItem(VOTES_KEY)) || []); } catch (e) { return new Set(); }
}
export function saveMyVotes(set) {
  try { localStorage.setItem(VOTES_KEY, JSON.stringify([...set])); } catch (e) {}
}

// quick client-side cooldown. real rate limiting comes later, server side
function checkCooldown() {
  let last = 0;
  try { last = Number(localStorage.getItem(LAST_POST_KEY)) || 0; } catch (e) {}
  const wait = POST_GAP_MS - (Date.now() - last);
  if (wait > 0) fail(`Wait ${Math.ceil(wait / 1000)}s before posting again`);
}
function markPosted() {
  try { localStorage.setItem(LAST_POST_KEY, String(Date.now())); } catch (e) {}
}

/* ---------- demo mode (no supabase keys) ---------- */
const demoPosts = [
  { id: 'd1', who: 'Lab owner', time: '2h', tag: 'Breeding', q: 'Is this heat cycle normal?',
    body: 'Day 4, bleeding is heavier than her last cycle and she keeps licking. 2 yr old Labrador. Should I worry?', replies: 1, helpful: 31 },
  { id: 'd2', who: 'First-time breeder', time: '5h', tag: 'Whelping', q: 'What temp for the whelping box?',
    body: 'Litter due in about 9 days. What temperature do you keep the box at for newborns?', replies: 0, helpful: 19 },
  { id: 'd3', who: 'Boerboel owner', time: '1d', tag: 'Studs', q: 'What is a fair stud fee?',
    body: 'Male, 3 yrs, hips cleared. I keep seeing quotes from ₦100k to ₦300k. What do you all pay?', replies: 0, helpful: 44 },
];
const demoReplies = { d1: [{ id: 'r1', body: 'Heavier on day 4 can be normal. If it goes past 3 weeks or smells bad, see a vet.', time: '1h' }] };

/* ---------- posts ---------- */
// newest first. replies(count) brings the reply number in the same trip
export async function fetchPosts() {
  if (!supabase) return [...demoPosts];
  const { data, error } = await supabase.from('posts')
    .select(`${POST_COLS}, replies(count)`).order('created_at', { ascending: false }).limit(50);
  if (error) fail('Could not load the feed');
  return data.map(toPost);
}

export async function createPost({ question, body, tag }) {
  checkCooldown();
  if (!supabase) {
    const post = { id: 'd' + Date.now(), who: '', time: 'now', tag, q: question, body, replies: 0, helpful: 0 };
    demoPosts.unshift(post); markPosted();
    return post;
  }
  const { data, error } = await supabase.from('posts').insert({ question, body, tag }).select(POST_COLS).single();
  if (error) fail('Could not post. Try again.');
  markPosted();
  return toPost(data);
}

// +1 or -1. the db function clamps it so nobody can jump the count
export async function setHelpful(postId, delta) {
  if (!supabase) return;
  const { error } = await supabase.rpc('bump_helpful', { post_id: postId, delta });
  if (error) fail('Vote did not save');
}

/* ---------- replies ---------- */
export async function fetchReplies(postId) {
  if (!supabase) return demoReplies[postId] || [];
  const { data, error } = await supabase.from('replies')
    .select('id, body, created_at').eq('post_id', postId).order('created_at', { ascending: true });
  if (error) fail('Could not load replies');
  return data.map(toReply);
}

export async function createReply({ postId, body }) {
  if (!supabase) {
    const reply = { id: 'r' + Date.now(), body, time: 'now' };
    (demoReplies[postId] ||= []).push(reply);
    return reply;
  }
  const { data, error } = await supabase.from('replies')
    .insert({ post_id: postId, body }).select('id, body, created_at').single();
  if (error) fail('Could not send reply');
  return toReply(data);
}

/* ---------- live updates ---------- */
// pings onChange when anyone posts, replies or votes. returns an unsubscribe fn
export function watchFeed(onChange) {
  if (!supabase) return () => {};
  const channel = supabase.channel('feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, onChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies' }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
