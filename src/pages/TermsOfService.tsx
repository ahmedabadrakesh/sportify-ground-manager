import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 19, 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By accessing and using SportsArena, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Permission is granted to temporarily access SportsArena for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a 
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Booking and Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  When you make a booking through SportsArena:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>You agree to pay the full amount for the booking</li>
                  <li>Cancellations must be made according to the facility's cancellation policy</li>
                  <li>You are responsible for any damages to the facility during your booking</li>
                  <li>Age restrictions and facility rules must be followed</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  When creating an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for safeguarding the 
                  password and for all activities that occur under your account.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>You may not use our service:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sports Professional Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  SportsArena acts as a platform connecting users with sports professionals. 
                  We are not responsible for the quality, safety, or legality of services 
                  provided by sports professionals. Users engage with professionals at their own risk.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                The materials on SportsArena are provided on an 'as is' basis. SportsArena makes 
                no warranties, expressed or implied, and hereby disclaim and negate all other 
                warranties including without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                In no event shall SportsArena or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the materials 
                on SportsArena, even if SportsArena or an authorized representative has been 
                notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at 
                legal@sportsarena.com or through our contact form.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;