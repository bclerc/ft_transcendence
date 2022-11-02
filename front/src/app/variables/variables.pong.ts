
export class VariablePong
{
    PLAYER_RADIUS = 3.5;
    CANVAS_RADIUS = 20;
    BALL_RADIUS = 4;
    PLAYER_HEIGHT = 65;
    PLAYER_WIDTH = 8;
    HEIGHTCANVAS = 400;
    WIDTHCANVAS = 600;
    FONT = 33;
    MAX_SCORE = 50;
    MAX_SPEED = 10; //ball
    defaultSpeed = 4; //speed de la balle par default
    SPEED_PLAYER = 8;

    /////
    //obstacls configs
    /////
    ////
    //// MAP1
    ///////// obstacle1
    MAP1_OBSTACLE1_W = 40; // width
    MAP1_OBSTACLE1_H = 125; // height
    MAP1_OBSTACLE1_POSX = (this.WIDTHCANVAS / 2) - (this.MAP1_OBSTACLE1_W / 2); // position x
    MAP1_OBSTACLE1_POSY = 0; // position y
    MAP1_OBSTACLE1_RADIUS = 2;
    ///////// obstacle2
    MAP1_OBSTACLE2_W = 40; // width
    MAP1_OBSTACLE2_H = 125; // height
    MAP1_OBSTACLE2_POSX = (this.WIDTHCANVAS / 2) - (this.MAP1_OBSTACLE2_W / 2); // position x
    MAP1_OBSTACLE2_POSY = (this.HEIGHTCANVAS - this.MAP1_OBSTACLE2_H); // position x
    MAP1_OBSTACLE2_RADIUS = 2;
    ////
    ////
    //// MAP2
    ///////// obstacle1
    MAP2_OBSTACLE_W = 150; // width
    MAP2_OBSTACLE_H = 20; // height
    MAP2_OBSTACLE_POSX = (this.WIDTHCANVAS / 2) - (this.MAP1_OBSTACLE1_W / 2); // position x
    MAP2_OBSTACLE_POSY = 0; // position y
    MAP2_OBSTACLE_SPEED = 1;
    MAP2_OBSTACLE_RADIUS = 2;
    ////
    ////

}