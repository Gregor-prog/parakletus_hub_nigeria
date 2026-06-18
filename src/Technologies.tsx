import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Technologies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero
          title="Parakletus Technologies: Building the Tools for Tomorrow in Africa"
        />

        {/* Mission */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center">
                Parakletus Technologies is the innovation engine and software development wing of the hub. Our mission is to build the digital infrastructure that will power Africa's next generation of businesses, educational institutions, and public services.
              </p>
            </div>
          </div>
        </section>

        {/* Product Suite */}
        <section className="py-20 bg-light-grey">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center text-primary">Our Product Suite</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Our diverse portfolio of proprietary products reflects this ambition:
              </p>

              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="paralearn" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    ParaLearn
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A cloud-based, AI-powered school management software and Learning Management System (LMS) that streamlines academic operations, personalizes student learning, and empowers educators.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="qualify" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Qualify AI
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A sophisticated B2B SaaS platform that acts as a central intelligence hub for sales and marketing teams, automating lead qualification and providing deep, actionable insights.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="taskflare" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    TaskFlare
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    An AI-powered social task management tool designed for high-performing teams, facilitating seamless collaboration, smart prioritization, and enhanced productivity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="timelockr" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    TimeLockr
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A secure and reliable biometric attendance application designed to modernize workforce management for businesses of all sizes, ensuring accuracy and accountability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="promptpress" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    PromptPress
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A revolutionary AI-powered book distribution tool that leverages data analytics and machine learning to optimize marketing and connect authors with global audiences, bridging the gap between creators and readers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="socialite" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Socialite
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    An intelligent social media management AI agent that automates content scheduling, engagement, and performance tracking, allowing brands to grow their digital presence effectively.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mymedic" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    MyMedic
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A vital healthcare application that enables the verifiable private practice of health professionals, enhancing patient access to care and ensuring provider credibility in a secure digital environment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ayololo" className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    Ayọ̀lọ̀
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    A planned tuition ledger concept designed to support future low-cost digital school fee settlements.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="text-center mt-12">
                <Link to="/contact">
                  <Button variant="cta" size="xl">
                    See Our Technology in Action
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

export default Technologies;
