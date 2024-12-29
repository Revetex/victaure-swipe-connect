import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { TodoList } from "@/components/TodoList";
import { VCard } from "@/components/VCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  { id: 'messages', title: 'Messages', component: Messages },
  { id: 'jobs', title: 'Offres', component: SwipeJob },
  { id: 'todos', title: 'Tâches', component: TodoList },
  { id: 'profile', title: 'Profil', component: VCard },
];

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const isMobile = useIsMobile();

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setActiveSection(index);
  };

  const handleSelect = () => {
    const currentIndex = api?.selectedScrollSnap();
    if (typeof currentIndex === 'number') {
      setActiveSection(currentIndex);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div 
        className={cn(
          "fixed left-1/2 transform -translate-x-1/2 z-50 flex gap-2 transition-all duration-300",
          isMobile ? "top-2" : "top-4"
        )}
      >
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              activeSection === index 
                ? "bg-primary w-4 h-2" 
                : "bg-muted hover:bg-primary/50 w-2 h-2",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            )}
            aria-label={`Go to ${section.title} section`}
          />
        ))}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="h-full w-full"
        setApi={setApi}
        onSelect={handleSelect}
      >
        <CarouselContent className="-ml-0">
          {sections.map((section, index) => (
            <CarouselItem key={section.id} className="pl-0 h-[calc(100vh-4rem)]">
              <div className={cn(
                "h-full w-full transition-all duration-300",
                isMobile ? "p-2" : "p-4"
              )}>
                <div className="glass-card h-full rounded-lg p-3 sm:p-4 overflow-y-auto">
                  <section.component />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}