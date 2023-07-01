// tinj - [t]est value [inj]ection
//
// The possible tinj0-tinj9999 values allow you to to repurpose a line of code
// of implementation, optionally reversing* its implementation
//
// * reversing the code line could mean to disfeature it, or to resurrect a bug
//   the code line is fixing, by null-coalescing with an injected test value
//
// Example implementation for the feature 'negative values become positive':
//     let abs = (n) => tinj11 ?? Math.abs(n);
//
// Abs-value test (test#11) featured test:
//     tinj(11, null);
//     console.assert(abs(-1) > -1);
//
// Abs-value (test#11) disfeatured test:
//     tinj(11, -1);
//     console.assert(abs(-1) < 0);
//
// For each featured-disfeatured pairing, use a different tinj# (test number)
// so you can cross-reference a unit test pair with its implementation code.
//
export function tinj(t, inj, scope) {
    for (let i=0; i<t; i++) { scope['tinj'+i] = null; }
    scope['tinj'+t] = inj;
    for (let i=t+1; i<10000; i++) { scope['tinj'+i] = null; }
}

