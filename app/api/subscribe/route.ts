export async function POST(req: Request) {
  const { email, score, level } = await req.json();
  console.log("New lead:", { email, score, level });
  // TODO: insert into supabase table 'leads' con campos: email, score, level, created_at
  // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  // await supabase.from('leads').insert({ email, score, level, created_at: new Date().toISOString() })
  return Response.json({ success: true });
}
