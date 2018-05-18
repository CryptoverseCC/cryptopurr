import qs from 'qs';
import escape from 'escape-html';
import QRious from 'qrious';
import IpfsAdd from 'ipfs-api/src/add';
import html2canvas from 'html2canvas';

import { colors } from '../entityApi';

const isDev = process.env.NODE_ENV === 'development';
const ipfsAdd = IpfsAdd({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', 'api-path': '/api/v0/' });
const isSvg = /.svg$/;

const { token_id, content, etherscan_url, link } = qs.parse(window.location.search.replace('?', ''));

const $container = document.querySelector('.main');
const $catAvatarImg = document.querySelector('.kitten_img .img');
const $catId = document.querySelector('.kitty-name');
const $message = document.querySelector('.text p');
const $qr = document.querySelector('.qr canvas');
const $footer = document.querySelector('.link');

fetch(`https://api.cryptokitties.co/kitties/${token_id}`)
  .then((res) => res.json())
  .then((catInfo) => {
    if (catInfo.name) {
      $catId.innerHTML += catInfo.name;
    } else {
      $catId.innerHTML += `#${token_id}`;
    }

    $catAvatarImg.style.background = colors[catInfo.color];

    return drawImageOnCanvas(catInfo.image_url_cdn, $catAvatarImg);
  })
  .then(() => {
    if (isInIframe()) {
      shoot($container)
        .then((blob) => uploadToIpfs(blob))
        .then((ipfsHash) => {
          window.parent.postMessage(ipfsHash, '*');
        });
    }
  });

$message.innerHTML = escape(content);

new QRious({
  element: $qr,
  value: etherscan_url,
});

$footer.innerHTML = link;

const $numWords = $message.textContent.split(' ').length;

if ($numWords >= 1 && $numWords < 10) {
  $message.style.fontSize = '6em';
} else if ($numWords >= 10 && $numWords < 20) {
  $message.style.fontSize = '4em';
} else if ($numWords >= 20 && $numWords < 30) {
  $message.style.fontSize = '3.5em';
} else if ($numWords >= 30 && $numWords < 40) {
  $message.style.fontSize = '3em';
} else if ($numWords >= 40 && $numWords < 50) {
  $message.style.fontSize = '2.5em';
} else if ($numWords >= 50 && $numWords < 60) {
  $message.style.fontSize = '2em';
} else {
  $message.style.fontSize = '1.5em';
}

function drawImageOnCanvas(imageUrl, $canvas) {
  return fetch(`https://cors-anywhere.herokuapp.com/${imageUrl}`)
    .then((res) => {
      if (!isSvg.test(imageUrl)) {
        return res.blob();
      }

      return res.text().then((svg) => {
        const svgElement = new DOMParser().parseFromString(svg, 'image/svg+xml').firstChild;
        const width = svgElement.getAttribute('width');
        const height = svgElement.getAttribute('height');
        if (!width && !height) {
          svgElement.setAttribute('width', 300);
          svgElement.setAttribute('height', 300);
        }

        return new Blob([svgElement.outerHTML], { type: 'image/svg+xml' });
      });
    })
    .then((blob) => URL.createObjectURL(blob))
    .then(
      (imgURL) =>
        new Promise((resolve) => {
          const img = document.createElement('img');
          img.onload = () => {
            URL.revokeObjectURL(imgURL);
            resolve(img);
          };
          img.src = imgURL;
        }),
    )
    .then((img) => {
      const context = $canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, $canvas.width, $canvas.height);
    });
}

function shoot($element) {
  return html2canvas($element, {
    logging: isDev,
    scale: 1,
  }).then(
    (canvas) =>
      new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
      }),
  );
}

function uploadToIpfs(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', () => {
      const arrayBuffer = reader.result;
      ipfsAdd(Buffer.from(arrayBuffer)).then(([{ hash }]) => resolve(hash));
    });
    reader.readAsArrayBuffer(blob);
  });
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
