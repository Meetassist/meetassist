import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type MeetingSummaryEmailProps = {
  meetingTitle?: string;
  dateSent?: string;
  summary?: string;
  actionItems?: string[] | undefined;
  meetingId: string | null;
  baseUrl: string;
  image: string;
};

export const MeetingSummaryEmail = ({
  meetingTitle = "Your meeting",
  summary,
  actionItems,
  meetingId,
  dateSent,
  baseUrl,
  image,
}: MeetingSummaryEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{meetingTitle}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 py-10 font-sans">
          <Container className="mx-auto max-w-[600px] rounded-lg border border-gray-200 bg-white p-8">
            <Section className="mb-8">
              <Row>
                <Column>
                  <Img
                    src={image}
                    width="40"
                    height="40"
                    alt="Meetassist Logo"
                  />
                </Column>
                <Column align="right">
                  <Link
                    href={`${baseUrl}`}
                    className="text-sm font-medium text-blue-600"
                  >
                    Visit Meetassist
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section className="mb-6">
              <Heading className="m-0 text-2xl leading-tight font-bold text-gray-900">
                {meetingTitle}
              </Heading>
              <Text className="mt-1 text-sm text-gray-500">{dateSent}</Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            {/* Summary Section */}
            <Section className="mb-6">
              <Heading
                as="h2"
                className="mb-2 text-lg font-semibold text-gray-800"
              >
                Summary
              </Heading>
              <Text className="m-0 leading-relaxed text-gray-700">
                {summary}
              </Text>
              {meetingId && (
                <Link
                  href={`${baseUrl}/dashboard/chats?id=${meetingId}`}
                  className="mt-1 inline-block font-medium text-blue-600 no-underline"
                >
                  See full summary <span className="text-lg">→</span>
                </Link>
              )}
            </Section>

            <Section>
              <Heading
                as="h2"
                className="mb-2 text-lg font-semibold text-gray-800"
              >
                Action Items
              </Heading>
              <ul className="m-0 p-0">
                {actionItems?.map((item, index) => (
                  <li key={index} className="mb-2 list-none text-gray-700">
                    <Text className="m-0">• {item}</Text>
                  </li>
                ))}
              </ul>
              {meetingId && (
                <Link
                  href={`${baseUrl}/dashboard/chats?id=${meetingId}`}
                  className="mt-1 inline-block font-medium text-blue-600 no-underline"
                >
                  See full action items <span className="text-lg">→</span>
                </Link>
              )}
            </Section>

            <Hr className="mt-10 mb-4 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">
              Sent by Meetassist
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MeetingSummaryEmail;
