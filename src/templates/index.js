// Portfolio Template Components
import ModernMinimal from './ModernMinimal';
import CreativeGradient from './CreativeGradient';
import ProfessionalDark from './ProfessionalDark';
import BoldColorful from './BoldColorful';
import ElegantClassic from './ElegantClassic';
import TechFuturistic from './TechFuturistic';
import CleanCorporate from './CleanCorporate';
import ArtisticPortfolio from './ArtisticPortfolio';
import DeveloperShowcase from './DeveloperShowcase';
import DesignerCreative from './DesignerCreative';

export const templates = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and minimalist design with focus on content',
    component: ModernMinimal,
    tags: ['Minimal', 'Clean', 'Professional'],
    thumbnailGradient: 'bg-gradient-to-br from-gray-100 to-gray-300',
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Vibrant gradients and modern aesthetics',
    component: CreativeGradient,
    tags: ['Creative', 'Colorful', 'Modern'],
    thumbnailGradient: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
  },
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: 'Sleek dark theme for tech professionals',
    component: ProfessionalDark,
    tags: ['Dark', 'Professional', 'Tech'],
    thumbnailGradient: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900',
  },
  {
    id: 'bold-colorful',
    name: 'Bold Colorful',
    description: 'Stand out with bold colors and dynamic layout',
    component: BoldColorful,
    tags: ['Bold', 'Colorful', 'Dynamic'],
    thumbnailGradient: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
  },
  {
    id: 'elegant-classic',
    name: 'Elegant Classic',
    description: 'Timeless elegance with sophisticated typography',
    component: ElegantClassic,
    tags: ['Elegant', 'Classic', 'Sophisticated'],
    thumbnailGradient: 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300',
  },
  {
    id: 'tech-futuristic',
    name: 'Tech Futuristic',
    description: 'Cutting-edge design with futuristic elements',
    component: TechFuturistic,
    tags: ['Futuristic', 'Tech', 'Innovative'],
    thumbnailGradient: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
  },
  {
    id: 'clean-corporate',
    name: 'Clean Corporate',
    description: 'Professional corporate look for business',
    component: CleanCorporate,
    tags: ['Corporate', 'Business', 'Clean'],
    thumbnailGradient: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
  },
  {
    id: 'artistic-portfolio',
    name: 'Artistic Portfolio',
    description: 'Express your creativity with artistic layout',
    component: ArtisticPortfolio,
    tags: ['Artistic', 'Creative', 'Unique'],
    thumbnailGradient: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400',
  },
  {
    id: 'developer-showcase',
    name: 'Developer Showcase',
    description: 'Perfect for developers with code-focused design',
    component: DeveloperShowcase,
    tags: ['Developer', 'Code', 'Technical'],
    thumbnailGradient: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
  },
  {
    id: 'designer-creative',
    name: 'Designer Creative',
    description: 'Showcase design work with visual emphasis',
    component: DesignerCreative,
    tags: ['Designer', 'Visual', 'Portfolio'],
    thumbnailGradient: 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600',
  },
];
