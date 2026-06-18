import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, GraduationCap, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          title="Architecting Transformative Solutions for Africa"
          subtitle="Parakletus Hub Nigeria is empowering the continent by creating innovative, accessible, and scalable platforms in education and technology. We are dedicated to architecting transformative solutions for Africa's most pressing challenges."
          variant="gradient"
        >
          <Link to="/subsidiaries">
            <Button variant="hero" size="xl">
              Explore Our Solutions
            </Button>
          </Link>
        </Hero>

        {/* Ecosystem Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="mb-6 text-primary">Our Ecosystem: An Integrated Approach to Innovation</h2>
              <p className="text-lg text-muted-foreground">
                We operate as an integrated ecosystem, harnessing the specialized expertise of our subsidiaries. This multi-pronged approach allows us to build powerful synergies—from developing cutting-edge software and fostering critical digital skills to disseminating vital knowledge and convening the continent's brightest minds. We are a dynamic "hub" of specialized divisions, each a center of excellence in its own right.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ambitious-purple/10 mb-4">
                  <Code className="h-8 w-8 text-ambitious-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Technology</h3>
                <p className="text-muted-foreground">Building scalable digital infrastructure</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-creative-orange/10 mb-4">
                  <BookOpen className="h-8 w-8 text-creative-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Publishing</h3>
                <p className="text-muted-foreground">Disseminating vital knowledge</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-professional-blue/10 mb-4">
                  <GraduationCap className="h-8 w-8 text-professional-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Education</h3>
                <p className="text-muted-foreground">Fostering critical digital skills</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Solutions */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-center mb-12 text-primary">Featured Solutions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-ambitious-purple/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-ambitious-purple" />
                  </div>
                  <CardTitle>ParaLearn</CardTitle>
                  <CardDescription>
                    Our cloud-based, AI-powered school management software (LMS) that streamlines academic operations, personalizes student learning, and empowers educators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/technologies">
                    <Button variant="link" className="px-0">
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-lemon-green/10 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-lemon-green" />
                  </div>
                  <CardTitle>Ayọ̀lọ̀</CardTitle>
                  <CardDescription>
                    A planned tuition ledger concept designed to support future low-cost digital school fee settlements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/technologies">
                    <Button variant="link" className="px-0">
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-creative-orange/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-creative-orange" />
                  </div>
                  <CardTitle>Explore EdTech</CardTitle>
                  <CardDescription>
                    Our flagship international conference and expo, convening the continent's brightest minds to foster collaboration, showcase innovation, and set the agenda for the future of learning in Africa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/explore-edtech">
                    <Button variant="link" className="px-0">
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-20 bg-gradient-to-r from-professional-blue to-ambitious-purple text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="mb-6 text-white">Join Us in Building the Future</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              By integrating technology with human potential, Parakletus Hub Nigeria serves as a catalyst for sustainable development, economic growth, and intellectual empowerment across Africa.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Partner With Us
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
