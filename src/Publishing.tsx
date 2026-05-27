import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileEdit, Award } from "lucide-react";

const Publishing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero - Creative Orange theme */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-creative-orange to-lemon-green text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6 font-bold tracking-tight text-white">
                Parakletus Publishing: Bringing the Writer in You to Life
              </h1>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center" style={{ color: "hsl(var(--creative-orange))" }}>Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center">
                Parakletus Publishing is the literary and academic arm of Parakletus Hub Nigeria, dedicated to cultivating and disseminating knowledge. Our mission is to empower authors, researchers, and creators by providing a comprehensive support system that guides ideas from concept to publication. We believe in the power of the written word to educate, inspire, and drive change.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-12 text-center" style={{ color: "hsl(var(--creative-orange))" }}>Our Services</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                We are designed to nurture talent at every stage. Our core services include:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-lemon-green/20">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--lemon-green) / 0.1)" }}>
                      <FileEdit className="h-6 w-6" style={{ color: "hsl(var(--lemon-green))" }} />
                    </div>
                    <CardTitle className="text-xl">Author Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Personalized author support, developmental editing, and strategic marketing and advertising.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-lemon-green/20">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--lemon-green) / 0.1)" }}>
                      <Users className="h-6 w-6" style={{ color: "hsl(var(--lemon-green))" }} />
                    </div>
                    <CardTitle className="text-xl">Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Specialized educational workshops and writing programs to foster vibrant intellectual communities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-lemon-green/20">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--lemon-green) / 0.1)" }}>
                      <Award className="h-6 w-6" style={{ color: "hsl(var(--lemon-green))" }} />
                    </div>
                    <CardTitle className="text-xl">Research Assistance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Robust academic research and writing assistance for scholars and institutions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Publications */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-6 text-center" style={{ color: "hsl(var(--creative-orange))" }}>Featured Publications</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Our commitment to knowledge is embodied in our key publications:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-2" style={{ borderColor: "hsl(var(--creative-orange) / 0.2)" }}>
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--creative-orange) / 0.1)" }}>
                      <BookOpen className="h-8 w-8" style={{ color: "hsl(var(--creative-orange))" }} />
                    </div>
                    <CardTitle className="text-2xl">Pearls Anthology</CardTitle>
                    <CardDescription className="text-base">
                      A vital platform for emerging poetic voices, capturing the diverse experiences and creative energy of new writers.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2" style={{ borderColor: "hsl(var(--creative-orange) / 0.2)" }}>
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--creative-orange) / 0.1)" }}>
                      <BookOpen className="h-8 w-8" style={{ color: "hsl(var(--creative-orange))" }} />
                    </div>
                    <CardTitle className="text-2xl">International Journal of Blockchain Research in Africa (IJBRA)</CardTitle>
                    <CardDescription className="text-base">
                      A premier, peer-reviewed journal that fosters critical research and discourse on the transformative potential of blockchain technology within an African context.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="text-center mt-12">
                <Link to="/contact">
                  <Button 
                    className="text-white shadow-lg hover:shadow-xl transition-all h-14 px-10 text-base" 
                    style={{ backgroundColor: "hsl(var(--lemon-green))" }}
                  >
                    Publish With Us
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

export default Publishing;
