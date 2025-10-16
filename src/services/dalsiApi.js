// DalSi AI API Integration
// Text-based AI: DalSi AI (Phi-3 model)
// Vision AI: DalSi Vi (Phi-3 Vision model)

const DALSIAI_SERVICE_URL = 'https://dalsiai-106681824395.asia-south2.run.app';
const DALSIAIVI_SERVICE_URL = 'https://dalsiaivi-service-594985777520.asia-south2.run.app';

/**
 * Generate text using DalSi AI (Text-only model)
 * @param {string} message - The input prompt
 * @param {number} maxLength - Maximum tokens to generate (default: 200)
 * @returns {Promise<Object>} Response with generated text
 */
export async function dalsiaiGenerateText(message, maxLength = 200) {
  const headers = { 'Content-Type': 'application/json' };
  const payload = { message, max_length: maxLength };

  try {
    const response = await fetch(`${DALSIAI_SERVICE_URL}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DalSi AI error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        endpoint: response.url,
        payload
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling DalSi AI generate endpoint:', error);
    return null;
  }
}

/**
 * Stream text generation using DalSi AI
 * @param {string} message - The input prompt
 * @param {number} maxLength - Maximum tokens to generate
 * @param {Function} onToken - Callback for each token
 * @param {Function} onComplete - Callback when generation completes
 * @param {Function} onError - Callback for errors
 */
export async function dalsiaiStreamText(message, maxLength = 200, onToken, onComplete, onError) {
  const headers = { 'Content-Type': 'application/json' };
  const payload = { message, max_length: maxLength };

  try {
    const response = await fetch(`${DALSIAI_SERVICE_URL}/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DalSi AI error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        endpoint: response.url,
        payload
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        // Flush any remaining bytes in the decoder
        decoder.decode(new Uint8Array(), { stream: false });
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() && line.startsWith('data: ')) {
          try {
            const jsonData = line.substring(6); // Remove 'data: ' prefix
            const data = JSON.parse(jsonData);

            if (data.token) {
              onToken(data.token);
            } else if (data.done) {
              onComplete();
            } else if (data.error) {
              onError(data.error);
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error calling DalSi AI stream endpoint:', error);
    if (onError) onError(error.message);
  }
}

/**
 * Generate multimodal response using DalSi Vi (Vision model)
 * @param {string} message - The input prompt
 * @param {string|null} imageDataUrl - Optional base64 image data URL
 * @param {number} maxLength - Maximum tokens to generate
 * @returns {Promise<Object>} Response with generated text
 */
export async function dalsiaiviGenerateMultimodal(message, imageDataUrl = null, maxLength = 200) {
  const headers = { 'Content-Type': 'application/json' };
  const payload = { message, max_length: maxLength };

  if (imageDataUrl) {
    payload.image_data_url = imageDataUrl;
  }

  try {
    const response = await fetch(`${DALSIAIVI_SERVICE_URL}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DalSi AI error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        endpoint: response.url,
        payload
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling DalSi Vi generate endpoint:', error);
    return null;
  }
}

/**
 * Stream multimodal generation using DalSi Vi
 * @param {string} message - The input prompt
 * @param {string|null} imageDataUrl - Optional base64 image data URL
 * @param {number} maxLength - Maximum tokens to generate
 * @param {Function} onToken - Callback for each token
 * @param {Function} onComplete - Callback when generation completes
 * @param {Function} onError - Callback for errors
 */
export async function dalsiaiviStreamMultimodal(message, imageDataUrl = null, maxLength = 200, onToken, onComplete, onError) {
  const headers = { 'Content-Type': 'application/json' };
  const payload = { message, max_length: maxLength };

  if (imageDataUrl) {
    payload.image_data_url = imageDataUrl;
  }

  try {
    const response = await fetch(`${DALSIAIVI_SERVICE_URL}/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DalSi AI error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        endpoint: response.url,
        payload
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        // Flush any remaining bytes in the decoder
        decoder.decode(new Uint8Array(), { stream: false });
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() && line.startsWith('data: ')) {
          try {
            const jsonData = line.substring(6);
            const data = JSON.parse(jsonData);

            if (data.token) {
              onToken(data.token);
            } else if (data.done) {
              onComplete();
            } else if (data.error) {
              onError(data.error);
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error calling DalSi Vi stream endpoint:', error);
    if (onError) onError(error.message);
  }
}

/**
 * Check health status of DalSi AI service
 * @returns {Promise<Object>} Health status
 */
export async function dalsiaiHealthCheck() {
  try {
    const response = await fetch(`${DALSIAI_SERVICE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking DalSi AI health:', error);
    return { status: 'error', model_loaded: false };
  }
}

/**
 * Check health status of DalSi Vi service
 * @returns {Promise<Object>} Health status
 */
export async function dalsiaiviHealthCheck() {
  try {
    const response = await fetch(`${DALSIAIVI_SERVICE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking DalSi Vi health:', error);
    return { status: 'error', model_loaded: false };
  }
}

