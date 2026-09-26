Convert #sym:ClickableStepper into one standalone, reusable component.

Keep its current appearance and behavior. Write the UI directly in this component and use standard Tailwind CSS utility classes for all styling. Remove dependencies on project-specific components, styles, theme classes, and utilities so the component can be copied into another React project. Keep the code simple, preserve or expose the necessary props, and avoid unrelated changes.



Convert every variant/example of #sym:Steps into a standalone, reusable React component.

Create one separate file per variant inside src/TestComponent (for example, BasicStepper.jsx, ClickableStepper.jsx, and ControlledStepper.jsx). Do not put multiple variants in one file.

Preserve each variant's current design and behavior. Use Tailwind CSS utilities for styling. Use icons from lucide-react if it is already installed; otherwise use the existing react-icons package. Do not draw icons with inline SVG or add a new dependency.

Avoid importing the project's Steps component or other project-specific UI components/styles. Update the original Steps demo to render the corresponding new component for each variant. Keep changes focused and verify the changed files with lint.