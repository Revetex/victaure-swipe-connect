import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { TodoList } from "@/components/TodoList";
import { VCard } from "@/components/VCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const sections = [
  { id: 'messages', title: 'Messages', component: Messages },
  { id: 'jobs', title: 'Offres', component: SwipeJob },
  { id: 'todos', title: 'Tâches', component: TodoList },
  { id: 'profile', title: 'Profil', component: VCard },
];

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setActiveSection(index);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      {/* Navigation dots */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {sections.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeSection === index 
                ? "bg-primary w-4" 
                : "bg-muted hover:bg-primary/50 cursor-pointer"
            )}
            onClick={() => scrollTo(index)}
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
        onSelect={setActiveSection}
      >
        <CarouselContent className="-ml-0">
          {sections.map((section, index) => (
            <CarouselItem key={section.id} className="pl-0 h-[calc(100vh-4rem)]">
              <div className="h-full w-full p-2 sm:p-4">
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