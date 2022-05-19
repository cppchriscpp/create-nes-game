<%- /* FIXME: This currently is very raw, and very much does not consider things like neslib. Do better */ %>

// Include defines for various pieces of the NES hardware
#include "system-defines.h"

<%- /* FIXME: Include bank helpers if appropriate here */ %>

//
// Global Variables (zeropage) 
// Small, frequently-used variables should go in this space. There are only around 250 bytes to go around, so choose wisely!
//
#pragma bss-name(push, "ZEROPAGE")
    unsigned char i;
#pragma bss-name(pop)

//
// Normal Variables
// You can define larger, less frequently accessed variables here. You have about 1.5k to work with.
//
// EXAMPLE: 
// unsigned char myBigBufferArray[32];
<% if (it.game.testProvider !== 'none') { %>
unsigned char testVariable;
<% } %>

//
// Constant variables
// Anything with const in front of it will go into write-only prg instead of the very limited ram we have.
//
const unsigned char welcomeMessage[] = "Make something unique!";

// Color palette for the screen to use
const unsigned char palette[] = { 
    0x0f, 0x00, 0x10, 0x13, 
    0x0f, 0x01, 0x21, 0x31,
    0x0f, 0x06, 0x16, 0x26,
    0x0f, 0x09, 0x19, 0x29
};

<% if (it.game.useSram) { %>
//
// SRAM Variables
// Variables in this section will not lose their value when the console is reset. 
// Make sure to clear the values if you expect them to be in a known state on first startup!
//

#pragma bss-name (push, "SRAM")

unsigned char testSramVariable;
// unsigned char yourVariableHere;

#pragma bss-name(pop)
<% } %>

//
// Main entrypoint
// This is where your game will start running. It should essentially be an endless loop in most
// cases. The name "main" tells the runtime to run this. You can add more methods in this file
// or others and call them as your game expands. 
// 
void main(void) {
    // Turn off the screen
    write_register(PPU_MASK, 0x00);

    // Read ppu status to reset the system
    read_register(PPU_STATUS);

    // Set the address of the ppu to $3f00 to set the background palette
    write_register(PPU_ADDR, 0x3f);
    write_register(PPU_ADDR, 0x00);

    // Write the background palette, byte-by-byte.
    for (i = 0; i != 16; ++i) {
        write_register(PPU_DATA, palette[i]);
    }

    // Write the address $2064 to the ppu, where we can start drawing text on the screen
    write_register(PPU_ADDR, 0x20);
    write_register(PPU_ADDR, 0x64);

    i = 0;
    while (welcomeMessage[i]) {
        // Add 0x60 to the ascii value of each character, to get it to line up with where the ascii table is in our chr file
        write_register(PPU_DATA, welcomeMessage[i] + 0x80);
        ++i;
    }

    <% if (it.game.useSram) { %>
    // Increment the test sram variable, which will be saved to the cart/disk
    ++testSramVariable;
    // Draw this value as a tile on the screen, right after our welcome message
    write_register(PPU_DATA, testSramVariable);
    <% } %>

    // Set the scroll to 0,0
    write_register(PPU_SCROLL, 0);
    write_register(PPU_SCROLL, 0);


    // Turn the screen back on
    write_register(PPU_MASK, 0x1e);

    <% if (it.game.testProvider !== 'none') { %>
    // Update variable used in unit tests
    testVariable = 1;
    <% } %>

    // Infinite loop to end things
    while (1) {}
}