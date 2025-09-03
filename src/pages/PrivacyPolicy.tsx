import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 19, 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Create an account or profile</li>
                  <li>Make a booking or purchase</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="mt-4">
                  This may include your name, email address, phone number,
                  payment information, and any other information you choose to
                  provide.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>
                    Communicate with you about products, services, and events
                  </li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect and prevent fraudulent transactions</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    With sports facilities and professionals to fulfill your
                    bookings
                  </li>
                  <li>
                    With service providers who assist us in operating our
                    platform
                  </li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger, sale, or acquisition</li>
                  <li>With your consent or at your direction</li>
                </ul>
                <p className="mt-4">
                  We do not sell, trade, or rent your personal information to
                  third parties for marketing purposes without your explicit
                  consent.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. This includes encryption of
                sensitive data, secure servers, and regular security
                assessments. However, no method of transmission over the
                Internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Google OAuth Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  When you sign in with Google, we receive basic profile
                  information including your name and email address. We use this
                  information to create and maintain your account. We do not
                  access any other Google services or data without your explicit
                  permission.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  We use cookies and similar tracking technologies to enhance
                  your experience, analyze usage patterns, and provide
                  personalized content. You can control cookie preferences
                  through your browser settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Object to certain uses of your information</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at
                  hello@jokova.com.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we discover that a child under 13 has provided us
                with personal information, we will delete such information
                immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. International Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If you are accessing our service from outside the country where
                our servers are located, your information may be transferred to,
                stored, and processed in that country. By using our service, you
                consent to this transfer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us at:
                <br />
                Email: hello@jokova.com
                <br />
                Or through our contact form on the website.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
