document.getElementById('btnToast').addEventListener('click', function () {
    let toast = new bootstrap.Toast(document.getElementById('miToast'));
    toast.show();
});