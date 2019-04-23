(function () {

    angular.module('ocrApp')
        .controller('uploadController', uploadController);

    uploadController.$inject = ['$scope', '$http', 'logger', '$timeout'];

    function uploadController($scope, $http, logger, $timeout) {
        $scope.isChooseImage = true;
        $('#imageFile').change(function(evt) {
            $scope.isChooseImage = false;
            var files = evt.target.files;
            var file = files[0];
            var fileSize = file.size / 1024 / 1024;
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImg').src = e.target.result;
                    $timeout(() => {
                        if (fileSize >= 2) {
                            resizeImage();
                        } else {
                            resizeCss()
                        }
                    }, 1);
                };
                reader.readAsDataURL(file);
                $timeout (() => {
                    $scope.isResize = true;
                },100)

            }
        });
        function resizeImage() {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var filesToUploads = document.getElementById('imageFile').files;
                var file = filesToUploads[0];
                if (file) {
                    var reader = new FileReader();
                    // Set the image once loaded into file reader
                    reader.onload = function (e) {
                        var img = document.createElement("img");
                        img.src = e.target.result;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        var MAX_WIDTH = 1980;
                        var MAX_HEIGHT = 1080;

                        var width = img.width;
                        var height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        resizeCss();
                        canvas.width = width;
                        canvas.height = height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);
                        $scope.imageSrc = canvas.toDataURL(file.type, 1);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        }

        function resizeCss() {
            var img = new Image();
            img.onload = function() {
                var MAX_WIDTH_CSS = 300;
                var MAX_HEIGHT_CSS = 300;
                var widthCss = this.width;
                var heightCss = this.height;
                if (widthCss > heightCss) {
                    if (widthCss > MAX_WIDTH_CSS) {
                        heightCss *= MAX_WIDTH_CSS / widthCss;
                        widthCss = MAX_WIDTH_CSS;
                    }
                } else {
                    if (heightCss > MAX_HEIGHT_CSS) {
                        widthCss *= MAX_HEIGHT_CSS / heightCss;
                        heightCss = MAX_HEIGHT_CSS;
                    }
                }
                $('#previewImg').css('height', heightCss).css('width', widthCss);
            };
            img.src = document.getElementById('previewImg').src;
            $scope.imageSrc = document.getElementById('previewImg').src;
        }

        $scope.upload = (img) => {
            if (!img) {
                return logger.error('Please choose image')
            }
            let imageBase64 = img.split(',')[1];
            let blob = base64toBlob(imageBase64, 'image/png');
            let file = new File([blob], 'Image.png');
            let fd = new FormData();
            fd.append('image', file);
            fd.append('encode', 1);
            return $http.post('https://cmnd.smartocr.vn/id/v1/recognition', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'api-key': 'a08eb42a-4a57-449b-84f4-1f67219f2679'
                }
            })
                .then((response) => {
                    if (response.data.result_code === 200) {
                        $scope.responseOcr = response.data;
                        let html = '';
                        if (response.data.front_flg === 0) {
                            html += `<p class="text-black"><b>Mặt</b>: Mặt trước</p>
                            <p class="text-black"><b>Họ tên</b>: ${response.data.name.toUpperCase()}</p>
                            <p class="text-black"><b>Số CMT</b>: ${response.data.id}</p>
                            <p class="text-black"><b>Ngày sinh</b>: ${response.data.birthday}</p>
                            <p class="text-black"><b>Địa chỉ</b>: ${response.data.address}</p>
                            <p class="text-black"><b>Giới tính</b>: ${response.data.sex}</p>
                        `
                        } else {
                            html += `
                            <p class="text-black"><b>Mặt </b>: Mặt sau</p>
                            <p class="text-black"><b>Nơi cấp</b>: ${response.data.issue_at === 'N/A'
                            || response.data.issue_at === null ? 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư' : response.data.issue_at
                                }</p>
                            <p class="text-black"><b>Ngày cấp </b>: ${response.data.issue_date}</p>
                        `
                        }
                        document.getElementById("json").innerHTML = html;
                    } else {
                        document.getElementById("json").innerHTML = 'Không thể nhận diện CMT';

                    }
                })
                .catch(err => console.log(err));

        };

        function base64toBlob(base64Data, contentType) {
            contentType = contentType || 'image/jpeg';
            let quality = 1.0;
            // contentType = contentType || 'image/png';
            let sliceSize = 512;
            let byteCharacters = atob(base64Data);
            let bytesLength = byteCharacters.length;
            let slicesCount = Math.ceil(bytesLength / sliceSize);
            let byteArrays = new Array(slicesCount);

            for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                let begin = sliceIndex * sliceSize;
                let end = Math.min(begin + sliceSize, bytesLength);

                let bytes = new Array(end - begin);
                for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, {type: 'image/jpeg'});
        }
    }
})();