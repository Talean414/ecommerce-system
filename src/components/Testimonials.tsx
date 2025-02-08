import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Blogger",
    content:
      "StepStyle has completely transformed my shoe game! Their collection is not only stylish but also incredibly comfortable. I've received so many compliments on my new shoes.",
    avatar: "/avatar1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Fitness Instructor",
    content:
      "As a fitness instructor, I need shoes that can keep up with my active lifestyle. StepStyle's athletic shoes provide the perfect balance of support and flexibility.",
    avatar: "/avatar2.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Office Professional",
    content:
      "I love how StepStyle offers a wide range of professional footwear that doesn't compromise on style. Their shoes are perfect for long days at the office.",
    avatar: "/avatar3.jpg",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto">
        <h2 className="font-heading text-4xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

