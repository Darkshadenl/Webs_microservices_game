# Basic information

Since we're using docker and docker hates node_modules the following explains how I bypass these problems:

### Node module installation

There is 3 places where node modules could exist:

- host
- volume
- container

Since we don't want our host modules to get copied to the container, 
we've added a dockerignore file which ignores node_modules.

On container build, the container installs the node modules in a folder above the sourcecode folder.
Now we can safely mount in the source code. 
Then we use another mount to remove the node_modules folder in the source code folder.
We want our container to only have packages that the container itself installed. 

Our application will automatically find the node_modules folder in the folder above the source code folder.

### If you want to install a new package...

Normally install it on the host. It will appear in the node_modules folder in the source code folder.
Then ssh into the docker container, and install it one folder above the source folder inside folder:
`/opt/`

You can also stay in the source code folder /opt/project/ and use command:

`yarn add underscore --modules-folder ../node_modules`

