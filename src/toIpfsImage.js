const templateUrl = 'https://userfeeds.io/purr/';
const DEFAULT_TIMEOUT = 30 * 1000;

export default function(content, link, etherscanUrl, tokenId) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');

    const timeoutID = setTimeout(() => {
      reject(Error('TIMEOUT'));
      clean();
    }, DEFAULT_TIMEOUT);

    const onMessage = (event) => {
      if (event.source === iframe.contentWindow) {
        clearTimeout(timeoutID);
        resolve(`https://ipfs.io/ipfs/${event.data}`);
        clean();
      }
    };

    const clean = () => {
      window.removeEventListener('message', onMessage);
      iframe.remove();
    };

    window.addEventListener('message', onMessage);

    iframe.src = `${templateUrl}?token_id=${tokenId}&etherscan_url=${encodeURIComponent(
      etherscanUrl,
    )}&link=${encodeURIComponent(link)}&content=${encodeURIComponent(content)}`;
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
  });
}
