

/*

considerations
- collaborative editing and version control
- type checking at runtime or typescript
  - sourcemap errors
- blocks can functions or data structures
  - functions and data structures are the same thing because functions construct data structures.
- no constraint solving for now, just one-way data flow

examples
- CSG editor
- Synthethizer
- Application Storyboard
- Contacts Application / Brain Web?!!

todo
- build a graph editor
  - zoom and move around the surface

    - zoom / scroll boundaries

    - view grid
    - view origin
    - view zoom and offset stats
    - zoom to fit


    - dragging autoscroll
    - tab through selection
    - block layer height
    - tests
      - grab and drag at the edges
      - scroll to move around
      - cmd scroll to zoom in and out
      - drag select should work anywhere
      - drag select should scroll at the edges
    - the blocks and the selection need to be on the same surface
    - drag-select should use window mousedow  ns and compute if its in the rect
    - dragstart caches the perspective and computes the diff to get the new position
  - new block goes in the middle
  - hold cmd to snap to grid
  - tab to toggle zoomed-out perspective
  - connect lines between blocks
  - group blocks to create recursive drawings
- persist everything immutably
- make it do some simple math

*/
