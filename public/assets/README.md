
# Assets Directory

Use this folder to store static assets such as:
- Images (PNG, JPG, SVG)
- Fonts
- Icons

## Available Assets
- `peyton.jpg`
- `linda.jpg`
- `Pete.jpg`
- `phill.jpg`
- `KtorZ.jpg`
- `cardano-yuta.jpeg`
- `bee.jpg`
- `cerny.jpg`
- `hornan.jpg`

## Usage in Components
You can import images directly in your React components:

```tsx
import myImage from '../../assets/my-image.png';

export const MyComponent = () => (
  <img src={myImage} alt="Description" />
);
```
