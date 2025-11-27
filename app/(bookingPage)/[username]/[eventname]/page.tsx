export default async function Page({
  params,
}: {
  params: Promise<{ username: string; eventname: string }>;
}) {
  const { username, eventname } = await params;
  let originalEmail: string;
  try {
    originalEmail = decodeURIComponent(username);
  } catch (error) {
    return <h1>Invalid booking link</h1>;
  }
  return (
    <h1>
      Book {eventname} with {originalEmail}
    </h1>
  );
}
