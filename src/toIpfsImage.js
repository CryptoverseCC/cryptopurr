const templateUrl = 'https://userfeeds.io/purr/';

export default function(content, link, etherscanUrl, tokenId) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');

    const onMessage = (event) => {
      if (event.source === iframe.contentWindow) {
        resolve(`https://ipfs.io/ipfs/${event.data}`);
        window.removeEventListener('message', onMessage);
        iframe.remove();
      }
    }
    window.addEventListener('message', onMessage);

    iframe.src = `${templateUrl}?token_id=${tokenId}&etherscan_url=${encodeURIComponent(etherscanUrl)}&link=${encodeURIComponent(link)}&content=${encodeURIComponent(content)}`;
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
  });
}