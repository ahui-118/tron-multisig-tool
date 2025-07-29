async function setMultisig() {
  const output = document.getElementById('output');
  output.textContent = '正在设置多签，请稍候...';

  const privateKey = document.getElementById('privateKey').value.trim();
  const addresses = [
    document.getElementById('addr1').value.trim(),
    document.getElementById('addr2').value.trim(),
    document.getElementById('addr3').value.trim(),
    document.getElementById('addr4').value.trim()
  ];

  try {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      privateKey: privateKey
    });

    const keys = addresses.map(addr => ({
      address: tronWeb.address.toHex(addr),
      weight: 1
    }));

    const threshold = 2;

    const tx = await tronWeb.transactionBuilder.accountPermissionUpdate(
      tronWeb.defaultAddress.base58,
      {
        type: 0,
        threshold: threshold,
        keys
      },
      [{
        type: 2,
        threshold: threshold,
        operations: '7fff1fc003ffffff',
        keys
      }]
    );

    const signedTx = await tronWeb.trx.sign(tx);
    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

    output.textContent = JSON.stringify(receipt, null, 2);
  } catch (err) {
    output.textContent = '错误：' + err.message;
  }
}
