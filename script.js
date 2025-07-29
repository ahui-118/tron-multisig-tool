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

    const ownerAddress = tronWeb.defaultAddress.base58;

    const keys = addresses.map(addr => ({
      address: tronWeb.address.toHex(addr),
      weight: 1
    }));

    const threshold = 2;

    const permissionData = {
      owner_permission: {
        type: 0,
        threshold: threshold,
        keys: keys
      },
      active_permissions: [{
        type: 2,
        threshold: threshold,
        operations: '7fff1fc003ffffff',
        keys: keys
      }]
    };

    const unsignedTx = await tronWeb.trx.sign(
      await tronWeb.request(
        'wallet/accountpermissionupdate',
        {
          owner_address: tronWeb.address.toHex(ownerAddress),
          ...permissionData
        }
      )
    );

    const result = await tronWeb.trx.sendRawTransaction(unsignedTx);

    output.textContent = '设置完成：\n' + JSON.stringify(result, null, 2);
  } catch (err) {
    output.textContent = '❌ 设置失败：' + err.message;
  }
}
