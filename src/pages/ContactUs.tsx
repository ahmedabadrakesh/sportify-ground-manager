import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";

const ContactUs = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="container bg-background border-b">
        <div className="grid md:grid-cols-8 mx-auto text-left py-4 mt-4 max-w-7xl">
          <div className="c mb-6 col-span-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Contact Us
            </h1>
            <p className="text-muted-foreground">Get in touch with JOKOVA</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 text-left">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {/* Email Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Mail className="h-5 w-5 text-[hsl(var(--sports-primary))]" />
                </div>
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:hello@jokova.com"
                className="text-lg text-[hsl(var(--sports-primary))] hover:underline"
              >
                hello@jokova.com
              </a>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Phone className="h-5 w-5 text-[hsl(var(--sports-primary))]" />
                </div>
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="tel:+919712910334"
                className="text-lg text-[hsl(var(--sports-primary))] hover:underline"
              >
                +91-9712910334
              </a>
            </CardContent>
          </Card>

          {/* Address Card - Full Width */}
          <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <MapPin className="h-5 w-5 text-[hsl(var(--sports-primary))]" />
                </div>
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg leading-relaxed">
                <p>3rd Floor, Nilkanth Duplex</p>
                <p>Opp. ITI, New Ranip</p>
                <p>Ahmedabad</p>
              </div>
              <Button variant="outline" className="gap-2" asChild>
                <a
                  href="https://www.google.com/maps/place/JOKOVA/@23.0971742,72.5594502,117m/data=!3m1!1e3!4m12!1m5!3m4!2zMjPCsDA1JzQ5LjkiTiA3MsKwMzMnMzUuMSJF!8m2!3d23.0971944!4d72.55975!3m5!1s0x395e83e876c893e7:0x49018ac6ca45eaa3!8m2!3d23.097147!4d72.5598668!16s%2Fg%2F11x9990lpy?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Map Embed - Full Width */}
          <Card className="md:col-span-2">
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234.41867748359064!2d72.55945019457768!3d23.09717420000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e83e876c893e7%3A0x49018ac6ca45eaa3!2sJOKOVA!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-lg"
                  title="JOKOVA Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </MainLayout>
  );
};

export default ContactUs;
