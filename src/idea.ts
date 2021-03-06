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
	- block definitions
		- function block and data block
		- ui fields, async fields
		- state machines


  - connect lines between blocks
    - Block types and Block fields
    - EdgeRegistry and EdgeStorage
    - Port types
    - Block types
    - how can we build languages, interact with code, compile and run, etc.
    - better edge paths
      - dynamic rigidity
      - control point up and down if delta.y is close to 0
  - group blocks to create recursive drawings
  - copy paste blocks

- persist everything immutably
- make it do some simple math

- later
  - hold cmd to snap to grid
  - control block layer height
  - zoom to fit
  - zoom / scroll boundaries
  - block dragging autoscroll
*/
