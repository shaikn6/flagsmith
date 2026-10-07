import React, { FC } from 'react'
import cx from 'classnames'

import { Tag as TTag } from 'common/types/responses'
import Chip, { ChipSize } from 'components/base/Chip'
import Icon from 'components/icons/Icon'
import ColorSwatch from 'components/ColorSwatch'
import Constants from 'common/constants'
import TagContent from 'components/tags/TagContent'
import './Tag.scss'
import { swatchName, tagChipColour } from 'components/tags/utils'

type TagType = {
  className?: string
  // A plan entitlement, not a UI state. See Utils.tagDisabled.
  disabled?: boolean
  onClick?: (tag: Partial<TTag>) => void
  selected?: boolean
  // Small where a tag labels something, base where it is the thing chosen.
  size?: ChipSize
  // Partial: the archived and untagged pseudo-tags have no id.
  tag: Partial<TTag>
  isDot?: boolean
}

// Unhealthy is ours, not the user's, so it does not come off the record. Here
// rather than utils: Constants would drag the app tree into the swatch test.
const getTagColor = (tag: Partial<TTag>) =>
  tag.type === 'UNHEALTHY' ? Constants.featureHealth.unhealthyColor : tag.color

const Tag: FC<TagType> = ({
  className,
  disabled = false,
  isDot,
  onClick,
  selected,
  size = 'sm',
  tag,
}) => {
  if (isDot) {
    // The stored colour, not the swatch: a tint this small would not read.
    return <ColorSwatch color={getTagColor(tag)} shape='circle' size='lg' />
  }

  // The chip is only a button when it has a live handler, and only a toggle
  // when it also tracks a selection.
  const isInteractive = !disabled && !!onClick
  const isToggle = isInteractive && selected !== undefined
  return (
    <Chip
      // A swatch has no text, so without this it is an unnamed button. Only
      // when it is one: on a plain span the label is dropped anyway.
      aria-label={
        isInteractive && !tag.label ? swatchName(getTagColor(tag)) : undefined
      }
      aria-pressed={isToggle ? selected : undefined}
      {...tagChipColour(tag)}
      className={cx(
        // The legacy `.chip` carried this; the primitive does not.
        'me-1',
        { 'tag--swatch': !tag.label },
        className,
      )}
      onClick={isInteractive ? () => onClick?.(tag) : undefined}
      size={size}
    >
      {/* Only a list tracking a selection passes `selected`, so a read-only
          tag gets no box. */}
      {selected !== undefined &&
        (tag.label ? (
          <span
            className={cx('tag-check', {
              'opacity-50': disabled,
              'tag-check--on': selected,
            })}
          >
            {selected && (
              <Icon
                name='checkmark'
                width={14}
                fill='var(--ds-chip-fill, var(--color-surface-default))'
              />
            )}
          </span>
        ) : (
          // A bare swatch has no room for a box, so the tick stands alone.
          selected && <Icon name='checkmark' width={14} />
        ))}
      <TagContent disabled={disabled} tag={tag} />
    </Chip>
  )
}

export default Tag
