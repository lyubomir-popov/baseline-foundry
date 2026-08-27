# Data Model: Resilient Sticky Footer and Hero Media

This feature has no persisted data. Its relevant entities are semantic layout regions and their relationships.

## Site application composition

- **Application shell**: Optional full-height host; owns application grid and the available viewport.
- **Application main**: Direct application child; owns scrolling and contains one site page shell in the consumer-shaped composition.
- **Site page shell**: Opted-in column flow; fills its containing application main or the document viewport.
- **Site main**: Direct page-shell child; owns document content and must not shrink below that content.
- **Sticky site footer**: Direct page-shell child; stays in normal flow and consumes remaining free space before itself on short pages.

State transitions: content changes the shell from a short-content state, where free space precedes the footer, to a long-content state, where the site main grows and the application main scrolls. The footer never changes positioning mode.

## Closing-media hero composition

- **Hero root**: Owns the pattern's compact entry and normal exit boundary.
- **Hero lead**: Structural text/content region that composes a shallow section boundary.
- **Hero media**: Associated full-width figure that follows the lead and is the final hero content.
- **Following section**: Starts only after the hero exit boundary.

Validation rules: the lead precedes media; media is final hero content; the shallow boundary is internal; the normal hero exit boundary remains external.
