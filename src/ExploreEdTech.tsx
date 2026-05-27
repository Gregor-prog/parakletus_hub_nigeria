import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, Rocket } from "lucide-react";

const ExploreEdTech = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero with dynamic conference imagery feel */}
        <section 
          className="py-32 md:py-40 bg-gradient-to-br from-professional-blue via-ambitious-purple to-creative-orange text-white relative"
        >
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6 font-bold tracking-tight text-white">
                Explore EdTech: Convening the Continent's Brightest Minds
              </h1>
            </div>
          </div>
        </section>

        {/* About the Event */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center text-primary">About the Event</h2>
              <p className="text-lg text-muted-foreground text-center">
                Explore EdTech is Parakletus Hub Nigeria's flagship international event. Evolving from our successful "EXPLORE" digital skills bootcamp series, it is now a premier conference and expo. This event serves as a critical convergence point for educators, entrepreneurs, policymakers, and technologists from across the continent and the globe.
              </p>
            </div>
          </div>
        </section>

        {/* Our Purpose */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-12 text-center text-primary">Our Purpose</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Foster Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Bringing together educators, entrepreneurs, and policymakers to create meaningful partnerships.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-creative-orange/10 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-creative-orange" />
                    </div>
                    <CardTitle>Showcase Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Highlighting cutting-edge innovations in educational technology across the continent.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-ambitious-purple/10 flex items-center justify-center mb-4">
                      <Rocket className="h-6 w-6 text-ambitious-purple" />
                    </div>
                    <CardTitle>Set the Agenda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Defining the strategic direction for the future of learning in Africa.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-card p-8 rounded-lg border-2 border-primary/10">
                <p className="text-lg text-center text-muted-foreground mb-8">
                  The purpose of Explore EdTech is to foster collaboration, showcase cutting-edge innovations in educational technology, and set the strategic agenda for the future of learning in Africa. It is more than a conference; it is a movement to accelerate the adoption of technology in education and to build the partnerships necessary to create a truly inclusive and high-quality learning ecosystem for all.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button variant="cta" size="xl">
                      Get Involved
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline_primary" size="xl">
                      Register Your Interest
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExploreEdTech;
