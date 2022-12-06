let awsCli = require("aws-cli-js");
var AWS = require("aws-sdk");
var ecr = new AWS.ECR({region: 'ap-southeast-1'})
let Aws = awsCli.Aws;
const aws = new Aws();

// variable 
let repository_name = "follow-service";
let range = ["January 01, 2021 12:30 PM", "March 10, 2021 12:30 PM"]

let dateRange = range.map(date => Date.parse(date))

// get credential aws sdk
AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

aws.command(`ecr describe-images --repository-name ${repository_name} `).then(function (data) {
    // Gathering data from ecr aws
    data = JSON.stringify(data);
    data = JSON.parse(data);
    data = data.object.imageDetails
    let imageDigest = [];

    // get data based on date range 
    let processData = (data) => {
        for (i=0; i < data.length; i++ ){ 
            if (data[i].imagePushedAt * 1000 >= dateRange[0] && data[i].imagePushedAt * 1000 <= dateRange[1] ) {
                imageDigest.push(data[i].imageDigest)
                let x = new Date (data[i].imagePushedAt * 1000)
                console.log(x.toString())
            }
        }
        return imageDigest;
    }

    let deleteImage = () => {   
        for (i=0; i <= imageDigest.length; i++) {
            var params = {
                imageIds: [ 
                  {
                    imageDigest: imageDigest[i]
                  },
                ],
                repositoryName: repository_name,
              };
              ecr.batchDeleteImage(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           
              });
        }
    }   
    processData(data)
    // deleteImage()
    console.log(imageDigest)
});
    

      


