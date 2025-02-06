import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NetworkInterface {
  name: string;
  ip: string;
  status: "up" | "down";
  speed: string;
}

export function NetworkSection() {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated network interfaces data
    const mockInterfaces: NetworkInterface[] = [
      { name: "eth0", ip: "192.168.1.100", status: "up", speed: "1 Gbps" },
      { name: "wlan0", ip: "192.168.1.101", status: "up", speed: "300 Mbps" },
      { name: "docker0", ip: "172.17.0.1", status: "up", speed: "10 Gbps" }
    ];

    setTimeout(() => {
      setInterfaces(mockInterfaces);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Interfaces réseau actualisées");
    }, 1000);
  };

  return (
    <Card className="p-6 h-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Interfaces Réseau</h2>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {interfaces.map((iface, index) => (
              <motion.div
                key={iface.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-card rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{iface.name}</h3>
                    <p className="text-sm text-muted-foreground">IP: {iface.ip}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{iface.speed}</span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        iface.status === "up"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {iface.status === "up" ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
