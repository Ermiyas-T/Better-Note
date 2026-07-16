import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";
interface EmailVerificationProps {
  userName: string;
  verificationUrl: string;
}
export function EmailVerification({
  userName,
  verificationUrl,
}: EmailVerificationProps) {
  // Email template for email verification with proper styling
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Verify your email address to complete your account setup
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="mx-auto bg-white rounded-[8px] px-[24px] py-[32px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Complete your account setup by verifying your email
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Thanks for signing up! To complete your account setup and ensure
                the security of your account, please verify your email address
                by clicking the button below.
              </Text>
              {/* <Text className="text-[14px] text-gray-600 mb-[24px] m-0">
                Email: <strong>{veri}</strong>
              </Text> */}
            </Section>

            {/* Verification Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-medium no-underline box-border"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                If the button doesn&apos;t work, copy and paste this link into your
                browser:
              </Text>
              <Link
                href={verificationUrl}
                className="text-blue-600 text-[14px] break-all"
              >
                {verificationUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="border-t border-solid border-gray-200 pt-[24px] mb-[24px]">
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                • This verification link will expire in 24 hours
              </Text>
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                • If you didn&apos;t create an account, please ignore this email
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                • Never share this verification link with others
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              {/* <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text> */}
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Business Street, Suite 100, Business City, BC 12345
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © 2024 Your Company. All rights reserved. |{" "}
                {/* <Link href="#" className="text-gray-500">
                  Unsubscribe
                </Link> */}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailVerification;
