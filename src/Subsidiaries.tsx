import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, BookOpen, GraduationCap, Calendar } from "lucide-react";

const Subsidiaries = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero
          title="A Synergistic Ecosystem"
          subtitle="Our strength lies in our specialized divisions. This model allows us to tackle complex problems from multiple angles, with each subsidiary supporting and amplifying the impact of the others. Together, they form a comprehensive ecosystem designed to build, educate, publish, and connect."
        />

        {/* Four Pillars */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-center mb-12 text-primary">Our Four Pillars of Innovation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Technologies */}
              <Card className="hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-professional-blue/10 flex items-center justify-center mb-4">
                    <Code className="h-8 w-8 text-professional-blue" />
                  </div>
                  <CardTitle className="text-2xl">Parakletus Technologies</CardTitle>
                  <CardDescription className="text-base">
                    Our innovation engine and software development wing, translating complex challenges into scalable, technology-driven solutions for Africa's next generation of businesses and institutions.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/technologies">
                    <Button variant="default">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Publishing */}
              <Card className="hover:shadow-xl transition-all border-2 border-transparent hover:border-creative-orange/20">
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-creative-orange/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-creative-orange" />
                  </div>
                  <CardTitle className="text-2xl">Parakletus Publishing</CardTitle>
                  <CardDescription className="text-base">
                    The literary and academic arm of the hub, dedicated to cultivating and disseminating knowledge by providing a comprehensive support system for authors, researchers, and creators.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/publishing">
                    <Button variant="default">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Academy */}
              <Card className="hover:shadow-xl transition-all border-2 border-transparent hover:border-ambitious-purple/20">
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-ambitious-purple/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-8 w-8 text-ambitious-purple" />
                  </div>
                  <CardTitle className="text-2xl">ParaLearn Academy</CardTitle>
                  <CardDescription className="text-base">
                    Our dedicated educational and training division, committed to bridging the digital skills gap and preparing Africa's workforce for the global economy through high-demand technology training.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/academy">
                    <Button variant="default">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Explore EdTech */}
              <Card className="hover:shadow-xl transition-all border-2 border-transparent hover:border-creative-orange/20">
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-creative-orange/10 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-creative-orange" />
                  </div>
                  <CardTitle className="text-2xl">Explore EdTech</CardTitle>
                  <CardDescription className="text-base">
                    Our flagship international event, a premier conference and expo that convenes the continent's brightest minds to foster collaboration and set the agenda for the future of learning in Africa.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/explore-edtech">
                    <Button variant="default">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Subsidiaries;
