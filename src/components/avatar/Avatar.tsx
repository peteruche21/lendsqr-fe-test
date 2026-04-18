import type { HTMLAttributes } from 'react'

type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  alt: string
  src: string
}

export function Avatar({ alt, className, src, style, ...avatarProps }: AvatarProps) {
  const classes = ['avatar', className ?? ''].filter(Boolean).join(' ')

  return (
    <span
      aria-label={alt}
      className={classes}
      role="img"
      style={{
        ...style,
        backgroundImage: `url(${src})`,
      }}
      {...avatarProps}
    />
  )
}

export type { AvatarProps }
