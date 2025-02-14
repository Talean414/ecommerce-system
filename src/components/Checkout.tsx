'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  total: number;
}

export function Checkout({ cartItems, total }: CheckoutProps) {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm()

  interface FormData {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    cardNumber?: string;
    cardName?: string;
    expiry?: string;
    cvv?: string;
  }

  interface ApiResponse {
    ok: boolean;
  }

  const onSubmit = async (data: FormData) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsProcessing(true);
    try {
      const response: ApiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, cartItems, total }),
      });

      if (!response.ok) throw new Error('Failed to place order');

      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { title: "Shipping", fields: ['name', 'email', 'address', 'city', 'country', 'postalCode'] },
    { title: "Payment", fields: ['cardNumber', 'cardName', 'expiry', 'cvv'] },
    { title: "Review", fields: [] },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          {steps.map((s, index) => (
            <div key={s.title} className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step > index ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                {index + 1}
              </div>
              <span className="ml-2">{s.title}</span>
              {index < steps.length - 1 && <div className="mx-2 border-t border-gray-300 w-8" />}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-4">
                <Input {...register('name', { required: 'Name is required' })} placeholder="Full Name" />
                {errors.name && typeof errors.name.message === 'string' && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                <Input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="Email" type="email" />
                {errors.email && typeof errors.email.message === 'string' && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                <Input {...register('address', { required: 'Address is required' })} placeholder="Address" />
                {errors.address && typeof errors.address.message === 'string' && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                <Input {...register('city', { required: 'City is required' })} placeholder="City" />
                {errors.city && typeof errors.city.message === 'string' && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                <Input {...register('country', { required: 'Country is required' })} placeholder="Country" />
                {errors.country && typeof errors.country.message === 'string' && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                <Input {...register('postalCode', { required: 'Postal Code is required' })} placeholder="Postal Code" />
                {errors.postalCode && typeof errors.postalCode.message === 'string' && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <Input {...register('cardNumber', { required: 'Card Number is required', pattern: { value: /^\d{16}$/, message: 'Invalid card number' } })} placeholder="Card Number" />
                {errors.cardNumber && typeof errors.cardNumber.message === 'string' && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
                <Input {...register('cardName', { required: 'Name on Card is required' })} placeholder="Name on Card" />
                {errors.cardName && typeof errors.cardName.message === 'string' && <p className="text-red-500 text-sm">{errors.cardName.message}</p>}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input {...register('expiry', { required: 'Expiry is required', pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Invalid expiry date (MM/YY)' } })} placeholder="MM/YY" />
                    {errors.expiry && typeof errors.expiry.message === 'string' && <p className="text-red-500 text-sm">{errors.expiry.message}</p>}
                  </div>
                  <div className="flex-1">
                    <Input {...register('cvv', { required: 'CVV is required', pattern: { value: /^\d{3,4}$/, message: 'Invalid CVV' } })} placeholder="CVV" />
                    {errors.cvv && typeof errors.cvv.message === 'string' && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </motion.div>
          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button type="button" onClick={() => setStep(step - 1)} variant="outline">
                Back
              </Button>
            )}
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : step < 3 ? 'Next' : 'Place Order'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

