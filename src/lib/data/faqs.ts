export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    slug: "general",
    icon: "CircleHelp",
  },
  {
    id: "dtf",
    name: "DTF",
    slug: "dtf",
    icon: "Flame",
  },
  {
    id: "screen-printing",
    name: "Screen Printing",
    slug: "screen-printing",
    icon: "Zap",
  },
  {
    id: "embroidery",
    name: "Embroidery",
    slug: "embroidery",
    icon: "Scissors",
  },
  {
    id: "shipping",
    name: "Shipping",
    slug: "shipping",
    icon: "Truck",
  },
];

export const faqs: FAQ[] = [
  // DTF FAQs
  {
    id: "dtf-what-is",
    category: "dtf",
    question: "What is DTF printing?",
    answer: "DTF (Direct-to-Film) printing is a revolutionary printing method where designs are printed onto a special film, then transferred to fabric using heat and pressure. It works on any fabric type - cotton, polyester, blends, and more - with vibrant colors and excellent durability.",
  },
  {
    id: "dtf-pricing",
    category: "dtf",
    question: "How much do DTF transfers cost?",
    answer: "Our DTF transfers start at $0.038 per square inch. Pricing depends on design size (measured in square inches), quantity ordered (bulk discounts available), design complexity (number of colors), and special effects (white ink, specialty finishes). Example: A 4\" x 4\" design (16 sq inches) would cost approximately $0.61 each.",
  },
  {
    id: "dtf-fabrics",
    category: "dtf",
    question: "What fabrics work with DTF transfers?",
    answer: "DTF transfers work on virtually any fabric: 100% Cotton, 100% Polyester, Cotton/Poly blends, Denim, Canvas, Leather (with proper heat settings), Nylon and synthetic fabrics.",
  },
  {
    id: "dtf-durability",
    category: "dtf",
    question: "How long do DTF transfers last?",
    answer: "When properly applied and cared for, DTF transfers can last 50+ wash cycles while maintaining vibrant colors and sharp details. For maximum durability, wash in cold water, inside out, and air dry when possible.",
  },

  // Ordering & Production FAQs
  {
    id: "order-minimums",
    category: "general",
    question: "What are your minimum order requirements?",
    answer: "No minimums for DTF transfers! You can order as few as 1 piece. Other services have different minimums: DTF Transfers - No minimum, Screen Printing - 12 pieces minimum, Embroidery - 6 pieces minimum, Sublimation - No minimum.",
  },
  {
    id: "turnaround-time",
    category: "general",
    question: "How long is your turnaround time?",
    answer: "Standard turnaround times: DTF Transfers - 2-5 business days, Screen Printing - 3-7 business days, Embroidery - 5-10 business days, Large Format - 2-5 business days. Rush orders available for additional fee. Contact us for expedited service options.",
  },
  {
    id: "file-formats",
    category: "general",
    question: "What file formats do you accept?",
    answer: "We accept high-resolution files in these formats: Vector files (AI, EPS, PDF, SVG) preferred for best quality, Raster files (PNG, JPEG, TIFF, PSD), Minimum resolution: 300 DPI at actual print size, For embroidery: DST, EMB files preferred. Don't have the right file format? We offer design services and file conversion.",
  },
  {
    id: "samples-proofs",
    category: "general",
    question: "Do you offer samples or proofs?",
    answer: "Yes! We provide digital proofs for all orders at no extra cost. Physical samples available for large orders or upon request (small fee may apply). We want you to be 100% satisfied before we begin production.",
  },
  {
    id: "satisfaction-guarantee",
    category: "general",
    question: "What if I'm not satisfied with my order?",
    answer: "Your satisfaction is our priority. If there's an issue with your order due to our error, we'll reprint at no cost. For quality concerns, contact us within 7 days of delivery. We stand behind our work with a satisfaction guarantee.",
  },
  {
    id: "design-services",
    category: "general",
    question: "Can you help with design work?",
    answer: "Absolutely! Our design services include logo creation and redesign, file format conversion, image cleanup and enhancement, text-based designs, color matching and adjustments. Design fees vary based on complexity. Contact us for a quote!",
  },

  // Screen Printing FAQs
  {
    id: "screen-printing-what-is",
    category: "screen-printing",
    question: "What is screen printing?",
    answer: "Screen printing is a traditional printing technique where ink is pushed through a mesh stencil onto fabric. It's ideal for bulk orders with bold, vibrant colors and offers the most cost-effective pricing for larger quantities.",
  },
  {
    id: "screen-printing-colors",
    category: "screen-printing",
    question: "How many colors can you print?",
    answer: "We can print up to 8 colors per design using traditional screen printing. Each color requires a separate screen, so pricing increases with the number of colors. For full-color designs, consider our DTF or sublimation services.",
  },

  // Embroidery FAQs
  {
    id: "embroidery-what-is",
    category: "embroidery",
    question: "What is embroidery?",
    answer: "Embroidery is the art of stitching designs directly onto fabric using specialized computer-controlled machines. It creates a professional, premium look perfect for corporate uniforms, polo shirts, caps, and jackets.",
  },
  {
    id: "embroidery-thread-counts",
    category: "embroidery",
    question: "How many thread colors are available?",
    answer: "We have access to over 50 thread colors to match your brand perfectly. We can closely match Pantone colors to ensure brand consistency. Standard thread colors are included in pricing.",
  },

  // Shipping FAQs
  {
    id: "shipping-locations",
    category: "shipping",
    question: "Do you ship across Canada?",
    answer: "Yes! We ship to all provinces and territories across Canada via Canada Post (Standard and express options), UPS (Ground and expedited service), Local delivery available in GTA area, and Pickup available by appointment. Shipping costs calculated at checkout based on size, weight, and destination.",
  },
  {
    id: "payment-methods",
    category: "shipping",
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment options: Credit cards (Visa, MasterCard, American Express), Debit cards, E-transfer (Canadian customers), PayPal, and Net 30 terms (approved business accounts). Payment is typically required before production begins, except for approved business accounts.",
  },
];

export default faqs;
