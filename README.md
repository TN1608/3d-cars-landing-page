# Supercar Scrollytelling Experience: A 3D Interactive Showcase

An immersive, high-performance web experience featuring a collection of high-fidelity 3D supercar models. This project is a technical demonstration of advanced PBR shading, synchronized camera scrollytelling, and creative frontend engineering using the React ecosystem.

## Overview

This project transforms traditional 2D automotive landing pages into a cinematic interactive journey. Inspired by high-end game lobbies, it demonstrates the orchestration of complex camera paths and UI transitions synchronized with user scroll progress.

## Technical Core

### 1. 3D Shading and Material Engineering
* **PBR Materials:** Custom implementation of `MeshStandardMaterial` to simulate realistic automotive paint, carbon fiber textures, and light interaction.
* **Refraction & Transparency:** Advanced glass rendering for windshields and headlights using transmission and thickness properties.
* **Asset Optimization:** Utilized `gltfjsx` with Draco compression to ensure heavy 3D assets are web-ready, maintaining a balance between visual fidelity and loading speed.

### 2. Camera Scrollytelling System
* **GSAP ScrollTrigger:** A non-linear animation system that maps DOM scroll offsets to 3D camera coordinates (x, y, z) and Euler rotations.
* **Dynamic Framing:** Programmatic camera orchestration designed to highlight specific mechanical and aerodynamic details of the vehicles.

### 3. Motion and UI Integration
* **React Bits Library:** Integration of sophisticated text components such as `DecryptedText` and `SplitText` for a high-tech, data-driven aesthetic.
* **Performance-First UI:** Built with Tailwind CSS and shadcn/ui, employing glassmorphism effects that render efficiently over the WebGL layer.
* **Smooth Navigation:** Implementation of Lenis Scroll to provide a consistent, momentum-based scrolling experience across different hardware.

## Tech Stack

* **Core:** React.js, Vite
* **3D Engine:** Three.js
* **React-3D Bridge:** React Three Fiber (R3F), @react-three/drei
* **Animation:** GSAP (ScrollTrigger), Framer Motion
* **Styling:** Tailwind CSS, shadcn/ui
* **Motion Text:** React Bits

## AI-Augmented Workflow

This project utilized an AI-assisted development process to:
* Optimize complex mathematical calculations for camera quaternions and spherical coordinates.
* Refactor R3F component structures for better memory management and reusability.
* Debug WebGL-specific performance bottlenecks and draw call optimizations.

## Development Goals

1. **Material Realism:** Mastering the interaction between environment maps (HDRIs) and physical materials.
2. **State Synchronization:** Maintaining a seamless link between the React state, DOM scroll events, and the Three.js render loop.
3. **Scalable Architecture:** Building a modular system capable of handling multiple complex 3D assets within a single unified framework.

## Getting Started

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/supercar-3d-experience.git](https://github.com/TN1608/3d-cars-landing-page.git)
   ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Run the development server:
  ```bash
  npm run dev
  ```

## Credits
3D Models: Sourced from professional creators on Sketchfab (CC-BY-4.0).
Design Inspiration: Premium automotive digital twins and creative developer portfolios
