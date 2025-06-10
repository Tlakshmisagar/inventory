import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { insertTransactionSchema, type InsertTransaction, type Product } from "@shared/schema";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const stockAdjustSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type StockAdjustForm = z.infer<typeof stockAdjustSchema>;

export default function StockAdjustModal({ isOpen, onClose, product }: StockAdjustModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<StockAdjustForm>({
    resolver: zodResolver(stockAdjustSchema),
    defaultValues: {
      type: "IN",
      quantity: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Stock adjusted",
        description: "Product stock has been successfully adjusted",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adjusting stock",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StockAdjustForm) => {
    const transaction: InsertTransaction = {
      productId: product.id,
      type: data.type,
      quantity: data.quantity,
    };
    createMutation.mutate(transaction);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Current stock: <span className="font-medium">{product.currentStock}</span>
          </p>
          <p className="text-sm text-gray-600">
            SKU: <span className="font-medium">{product.sku}</span>
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value: "IN" | "OUT") => form.setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Stock In (Add)</SelectItem>
                <SelectItem value="OUT">Stock Out (Remove)</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={form.watch("type") === "OUT" ? product.currentStock : undefined}
              {...form.register("quantity", { valueAsNumber: true })}
              placeholder="Enter quantity"
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.quantity.message}
              </p>
            )}
            {form.watch("type") === "OUT" && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {product.currentStock} units
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Adjust Stock
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
