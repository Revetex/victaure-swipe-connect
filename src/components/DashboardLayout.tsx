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

  const handleSelect = () => {
    const selectedIndex = api?.selectedScrollSnap();
    if (selectedIndex !== undefined) {
      setActiveSection(selectedIndex);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div 
        className={cn(
          "fixed left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4 transition-all duration-300",
          isMobile ? "top-2" : "top-4"
        )}
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-border flex gap-4">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative transition-all duration-300 rounded-full p-2 group",
                activeSection === index 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10"
              )}
              aria-label={`Aller à la section ${section.title}`}
            >
              <span className="text-lg">{section.icon}</span>
              <span 
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -bottom-6 text-xs font-medium whitespace-nowrap transition-all duration-300",
                  activeSection === index 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-1"
                )}
              >
                {section.title}
              </span>
            </button>
          ))}
        </div>
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
          {sections.map((section) => (
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