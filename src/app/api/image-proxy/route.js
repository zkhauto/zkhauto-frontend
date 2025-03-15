export async function GET(request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Image URL is required', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Failed to fetch image', { status: 500 });
  }
} 