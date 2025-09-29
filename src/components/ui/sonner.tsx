import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      className="toaster group"
      toastOptions={{
        style: {
          background: 'rgb(var(--popover))',
          color: 'rgb(var(--popover-foreground))',
          border: '1px solid rgb(var(--border))',
        },
      }}
      style={
        {
          "--normal-bg": "rgb(var(--popover))",
          "--normal-text": "rgb(var(--popover-foreground))",
          "--normal-border": "rgb(var(--border))",
          "--success-bg": "rgb(var(--success))",
          "--success-text": "rgb(var(--success-foreground))",
          "--success-border": "rgb(var(--success))",
          "--error-bg": "rgb(var(--destructive))",
          "--error-text": "rgb(var(--destructive-foreground))",
          "--error-border": "rgb(var(--destructive))",
          "--warning-bg": "rgb(var(--warning))",
          "--warning-text": "rgb(var(--warning-foreground))",
          "--warning-border": "rgb(var(--warning))",
          "--info-bg": "rgb(var(--info))",
          "--info-text": "rgb(var(--info-foreground))",
          "--info-border": "rgb(var(--info))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
