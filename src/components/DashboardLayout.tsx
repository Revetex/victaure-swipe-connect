import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { TodoList } from "@/components/TodoList";
import { VCard } from "@/components/VCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  { id: 'messages', title: 'Messages', component: Messages, icon: '💬' },
  { id: 'jobs', title: 'Offres', component: SwipeJob, icon: '💼' },
  { id: 'todos', title: 'Tâches', component: TodoList, icon: '📝' },
  { id: 'profile', title: 'Profil', component: VCard, icon: '👤' },
];

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const isMobile = useIsMobile();

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setActiveSection(index);
  };

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveSection(selectedIndex);
    });
  }, [api]);

  return (
    <div className="min-h-screen w-screen bg-background">
      <div className="pt-16 pb-20">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-0">
            {sections.map((section) => (
              <CarouselItem key={section.id} className="pl-0">
                <div className={cn(
                  "w-full transition-all duration-300",
                  isMobile ? "px-2" : "px-4"
                )}>
                  <section.component />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 bg-background/80 backdrop-blur-sm border-t border-border",
          isMobile ? "py-2" : "py-4"
        )}
      >
        <div className="flex gap-8">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative transition-all duration-300 rounded-lg px-3 py-2 group flex flex-col items-center gap-1",
                activeSection === index 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10"
              )}
              aria-label={`Aller à la section ${section.title}`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-xs font-medium">
                {section.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}