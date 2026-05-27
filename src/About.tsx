import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Network } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero
          title="About Parakletus Hub Nigeria"
          subtitle="A diversified technology and education organization dedicated to architecting transformative solutions for Africa's most pressing challenges."
        />

        {/* Mission & Vision */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-center mb-12 text-primary">Our Core Mission & Vision</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-primary">Our Mission</h3>
                      <p className="text-muted-foreground">
                        To solve key challenges in Africa by creating and deploying innovative, accessible, and impactful solutions in technology and education.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-primary">Our Vision</h3>
                      <p className="text-muted-foreground">
                        To be Africa's leading architect of a future where technology and education converge to unlock the full potential of every individual and community.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Network className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="mb-6 text-primary">Our Ecosystem: A Multi-Subsidiary Structure</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Parakletus Hub Nigeria's strength lies in its unique, synergistic structure. We are not a monolithic entity but a dynamic "hub" of specialized divisions, each a center of excellence in its own right.
                </p>
                <p className="text-lg text-muted-foreground">
                  This model is powerful because it allows us to tackle complex problems from multiple angles. Each subsidiary supports and amplifies the impact of the others, forming a comprehensive ecosystem designed to build, educate, publish, and connect. We believe this integration is key to creating lasting, transformative change across the continent.
                </p>
              </div>

              {/* Hub Visualization */}
              <div className="mt-16 relative">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="w-48 h-48 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-12 shadow-2xl">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">Parakletus</div>
                        <div className="text-xl">Hub</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-card p-6 rounded-lg shadow-md border border-primary/10">
                      <div className="w-12 h-12 rounded-full bg-professional-blue text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        Tech
                      </div>
                      <p className="text-sm font-semibold text-center">Technologies</p>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-md border border-creative-orange/20">
                      <div className="w-12 h-12 rounded-full bg-creative-orange text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        Pub
                      </div>
                      <p className="text-sm font-semibold text-center">Publishing</p>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-md border border-ambitious-purple/20">
                      <div className="w-12 h-12 rounded-full bg-ambitious-purple text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        Edu
                      </div>
                      <p className="text-sm font-semibold text-center">Academy</p>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-md border border-creative-orange/20">
                      <div className="w-12 h-12 rounded-full bg-creative-orange text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        Event
                      </div>
                      <p className="text-sm font-semibold text-center">Explore EdTech</p>
                    </div>
                  </div>
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

export default About;
