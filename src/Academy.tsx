import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Laptop, Award, Users } from "lucide-react";

const Academy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero - Purple/Blue theme */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-ambitious-purple to-professional-blue text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6 font-bold tracking-tight text-white">
                ParaLearn Academy: Upskilling the Next Generation of Africans
              </h1>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center" style={{ color: "hsl(var(--ambitious-purple))" }}>Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center">
                ParaLearn Academy is our dedicated educational and training division, committed to bridging the digital skills gap and preparing Africa's workforce for the global economy. Our mission is to provide accessible, high-quality training in high-demand technology fields, fostering a new generation of innovators, developers, and digital professionals.
              </p>
            </div>
          </div>
        </section>

        {/* ParaLearn Synergy */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="mb-6" style={{ color: "hsl(var(--ambitious-purple))" }}>The ParaLearn Synergy</h2>
                  <p className="text-lg text-muted-foreground">
                    Powered by our own robust ParaLearn LMS platform, the academy delivers a seamless and interactive learning experience. This powerful synergy—using our own technology to deliver our curriculum—ensures our programs are both cutting-edge and practical.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-ambitious-purple/10 to-professional-blue/10 rounded-lg p-8 border-2 border-ambitious-purple/20">
                  <div className="flex items-center justify-center h-64">
                    <Laptop className="h-32 w-32" style={{ color: "hsl(var(--ambitious-purple))" }} />
                  </div>
                  <p className="text-center font-semibold mt-4" style={{ color: "hsl(var(--ambitious-purple))" }}>
                    ParaLearn LMS Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-6 text-center" style={{ color: "hsl(var(--ambitious-purple))" }}>Our Offerings</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                ParaLearn Academy offers a range of courses, certifications, and bootcamps, connecting skilled graduates directly with opportunities in the tech ecosystem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2" style={{ borderColor: "hsl(var(--professional-blue) / 0.2)" }}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--professional-blue) / 0.1)" }}>
                      <GraduationCap className="h-6 w-6" style={{ color: "hsl(var(--professional-blue))" }} />
                    </div>
                    <CardTitle className="text-xl">Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Comprehensive courses in high-demand technology fields, from web development to data science.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: "hsl(var(--professional-blue) / 0.2)" }}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--professional-blue) / 0.1)" }}>
                      <Award className="h-6 w-6" style={{ color: "hsl(var(--professional-blue))" }} />
                    </div>
                    <CardTitle className="text-xl">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Industry-recognized certifications that validate your skills and open doors to new opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: "hsl(var(--professional-blue) / 0.2)" }}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--professional-blue) / 0.1)" }}>
                      <Users className="h-6 w-6" style={{ color: "hsl(var(--professional-blue))" }} />
                    </div>
                    <CardTitle className="text-xl">Bootcamps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Intensive bootcamps that fast-track your journey to becoming a tech professional.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <Link to="/contact">
                  <Button variant="cta" size="xl">
                    Start Learning Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academy;
