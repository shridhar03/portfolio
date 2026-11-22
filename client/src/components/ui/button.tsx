import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cloneElement, isValidElement, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// shadcn/ui-style primitive, restyled with the portfolio tokens.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium transition-[transform,translate,opacity,background-color,border-color,color,box-shadow] duration-300 ease-out-expo active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--color-accent)] hover:brightness-110',
        outline:
          'border border-border bg-transparent text-fg hover:-translate-y-0.5 hover:border-accent/60 hover:bg-surface-2',
        ghost: 'text-fg hover:bg-surface-2',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; roll?: boolean }

/**
 * Rolling hover (v2 spec): the label sits on the front face of a small 3D box and rolls up while a
 * copy rolls in from below. The copy is aria-hidden, so the accessible name is unchanged. CSS in
 * index.css ([data-roll]); reduced motion turns it into an instant (invisible) swap.
 */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span className="roll-face">{children}</span>
      <span className="roll-face roll-next" aria-hidden>
        {children}
      </span>
    </span>
  )
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  roll = size !== 'icon',
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  let content = children
  if (roll) {
    if (asChild && isValidElement<{ children?: ReactNode }>(children))
      content = cloneElement(children, undefined, <Roll>{children.props.children}</Roll>)
    else if (!asChild) content = <Roll>{children}</Roll>
  }
  return (
    <Comp
      data-roll={roll ? '' : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {content}
    </Comp>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { buttonVariants }
