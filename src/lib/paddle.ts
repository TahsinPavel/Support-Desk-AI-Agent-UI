// Client-side Paddle integration
declare const Paddle: any;

let paddleInstance: any = null;

export const initializePaddle = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (paddleInstance) {
    return paddleInstance;
  }

  // Check if Paddle is already loaded
  if (typeof Paddle !== 'undefined') {
    paddleInstance = Paddle;
    return paddleInstance;
  }

  // Load Paddle script
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (typeof Paddle !== 'undefined') {
        // @ts-ignore
        Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox');
        // @ts-ignore
        Paddle.Setup({ 
          vendor: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID 
        });
        // @ts-ignore
        paddleInstance = Paddle;
        resolve(paddleInstance);
      } else {
        reject(new Error('Failed to load Paddle'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Paddle script'));
    };
    document.head.appendChild(script);
  });
};

export const openPaddleCheckout = (
  paddle: any,
  priceId: string,
  email: string,
  successUrl: string,
  tenantId: string
) => {
  if (!paddle) {
    throw new Error('Paddle is not initialized');
  }

  return paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: { email },
    customData: {
      tenant_id: tenantId
    },
    settings: {
      successUrl: `${window.location.origin}${successUrl}`,
      displayMode: "inline",
      theme: "light",
    }
  });
};