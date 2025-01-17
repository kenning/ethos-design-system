import React from 'react'
import PropTypes from 'prop-types'

import useIncludes from '../../hooks/useIncludes.js'
import useInvalid from '../../hooks/useInvalid.js'
import { COLORS } from '../Colors'
import styles from './Type.module.scss'

/* @getethos/design-system/Type.js

   Legend:

   - `Type` is a private component that returns an element with CSS classes.
   - `Type.module.scss` styles the element via the classes.
   - `TypeFoundry` is a HOC that creates public components with correct props.
   - `<Caption.Medium500>`, etc. are the Design-approved public components.
   ========================================================================== */

/**
 * `Type` is a private component that returns an element with CSS classes.
 *
 * Note that it is ignorant of which combinations Design considers legal or
 * illegal. Legal combinations must be declared via the enumerated exports at
 * the end of this file.
 *
 * The public props (Type.PUBLIC_PROPS) may be passed in downstream.
 * Other props may only be specified in this file.
 *
 * @param  {String}  props.children       The text to display
 * @param  {Boolean} props.centered       Whether to text-align: center
 * @param  {Boolean} props.allCaps        Whether to text-transform to: uppercase
 * @param  {String}  props.element        Override the default <element>
 * @param  {String}  props.id             HTML id, used in aria-labelledby
 * @param  {String}  props.subtype        (private) e.g. Caption vs. TitleSmall
 * @param  {String}  props.typeface       (private) Typeface
 * @param  {String}  props.weight         (private) Typeface weight
 */
export const Type = ({
  children,
  centered,
  allCaps,
  color,
  element,
  subtype,
  typeface,
  weight,
  ...rest
}) => {
  // Verify that color, subtype, typeface, and weight were valid enum values
  const [isValidColor] = useIncludes(Type.COLORS)
  color && isValidColor(color)
  const [isValidSubtype] = useIncludes(Type.SUBTYPES)
  isValidSubtype(subtype)
  const [isValidTypeface] = useIncludes(Type.TYPEFACES)
  isValidTypeface(typeface)
  const [isValidWeight] = useIncludes(Type.WEIGHTS)
  isValidWeight(weight)

  const WHITELISTED_PROPS = ['htmlFor', 'data-tid', 'id']
  const [, isWhiteListedProp] = useIncludes(WHITELISTED_PROPS)
  isWhiteListedProp(rest)

  // Verify that no invalid props were supplied
  const [includesInvalid] = useInvalid(Object.keys(Type.PUBLIC_PROPS))
  includesInvalid(rest)

  // Generate list of css classes
  const classNames = [styles[subtype], styles[typeface], styles[weight]]
  if (color) classNames.push(styles[color])
  if (centered) classNames.push(styles.Centered)
  if (allCaps) classNames.push(styles.AllCaps)

  // Defaults to div, but can be overridden
  const Element = element || 'div'

  const allowedProps = Object.keys(rest).reduce((acc, key) => {
    acc[key] = rest[key]
    return acc
  }, {})

  return (
    <Element className={classNames.join(' ')} {...allowedProps}>
      {children}
    </Element>
  )
}

Type.SUBTYPES = {
  CAPTION: 'Caption', // smallest
  FOOTNOTE: 'Footnote',
  BODY: 'Body', // default
  TITLE_SMALL: 'TitleSmall',
  TITLE_MEDIUM: 'TitleMedium',
  TITLE_LARGE: 'TitleLarge',
  TITLE_XLARGE: 'TitleXLarge',
  TITLE_XXLARGE: 'TitleXXLarge',
}

Type.TYPEFACES = {
  THEINHARDT: 'Theinhardt', // sans
  CAMBON: 'Cambon', // serif
}

Type.WEIGHTS = {
  // Possibly we shouldn't lump these all together given they vary per typeface.
  LIGHT_300: 'Light300',
  REGULAR_400: 'Regular400',
  MEDIUM_500: 'Medium500',
  BOOK_500: 'Book500',
  DEMI_600: 'Demi600',
}

Type.COLORS = {
  // Brand
  BRAND_FOREST: COLORS.BRAND_FOREST,
  BRAND_SALAMANDER: COLORS.BRAND_SALAMANDER,

  // Grayscale
  GRAY_PRIMARY: COLORS.GRAY_PRIMARY,
  GRAY_SECONDARY: COLORS.GRAY_SECONDARY,
  GRAY_STROKE_AND_DISABLED: COLORS.GRAY_STROKE_AND_DISABLED,
  WHITE: COLORS.WHITE,
}

Type.ELEMENTS = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  DIV: 'div',
  LI: 'li',
  SPAN: 'span',
  LABEL: 'label',
}

Type.PUBLIC_PROPS = {
  children: PropTypes.node,
  centered: PropTypes.bool,
  allCaps: PropTypes.bool,
  color: PropTypes.oneOf(Object.values(Type.COLORS)),
  element: PropTypes.oneOf(Object.values(Type.ELEMENTS)),
  htmlFor: PropTypes.string,
  'data-tid': PropTypes.string,
  id: PropTypes.string,
}

Type.propTypes = {
  ...Type.PUBLIC_PROPS,
  typeface: PropTypes.oneOf(Object.values(Type.TYPEFACES)),
  weight: PropTypes.oneOf(Object.values(Type.WEIGHTS)),
}

export const TypeFoundry = (privateProps) => {
  function throwIllegalProp(prop) {
    const isIllegal = !Object.keys(Type.PUBLIC_PROPS).includes(prop)
    if (isIllegal) throw new TypeError(`Illegal prop '${prop}'`)
  }

  // TODO: figure out if downstream or upstream is the correct nomenclature here
  const PublicTypeComponent = (downstreamProps) => {
    Object.keys(downstreamProps).forEach(throwIllegalProp)
    return <Type {...downstreamProps} {...privateProps} />
  }

  return PublicTypeComponent
}
