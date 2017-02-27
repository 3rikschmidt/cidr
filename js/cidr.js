"use strict";
var cidr = (function () {
    var api = {
        isValidIp: isValidIp,
        cidrBits: cidrIpSlashBits,
        cidrMask: cidrIpSlashMask,
        bits2mask: bits2mask,
        ip42int: ip42int,
        int2ip4: int2ip4
    };

    arrayEquals(["1.2.3.4", "1.2.3.4"], cidrIpSlashBits("1.2.3.4", "32"));
    arrayEquals(["1.2.3.4", "1.2.3.5"], cidrIpSlashBits("1.2.3.4", "31"));
    arrayEquals(["1.2.3.4", "1.2.3.7"], cidrIpSlashBits("1.2.3.4", "30"));
    arrayEquals(["1.2.3.0", "1.2.3.7"], cidrIpSlashBits("1.2.3.4", "29"));
    arrayEquals(["1.2.3.0", "1.2.3.15"], cidrIpSlashBits("1.2.3.4", "28"));
    arrayEquals(["1.2.3.0", "1.2.3.31"], cidrIpSlashBits("1.2.3.4", "27"));
    arrayEquals(["1.2.3.0", "1.2.3.63"], cidrIpSlashBits("1.2.3.4", "26"));
    arrayEquals(["1.2.3.0", "1.2.3.127"], cidrIpSlashBits("1.2.3.4", "25"));
    arrayEquals(["1.2.3.0", "1.2.3.255"], cidrIpSlashBits("1.2.3.4", "24"));
    arrayEquals(["1.2.2.0", "1.2.3.255"], cidrIpSlashBits("1.2.3.4", "23"));
    arrayEquals(["1.2.0.0", "1.2.3.255"], cidrIpSlashBits("1.2.3.4", "22"));

    arrayEquals(["1.2.3.4", "1.2.3.4"], cidrIpSlashMask("1.2.3.4", "255.255.255.255"));
    arrayEquals(["1.2.3.4", "1.2.3.5"], cidrIpSlashMask("1.2.3.4", "255.255.255.254"));
    arrayEquals(["1.2.3.4", "1.2.3.7"], cidrIpSlashMask("1.2.3.4", "255.255.255.252"));
    arrayEquals(["1.2.3.0", "1.2.3.7"], cidrIpSlashMask("1.2.3.4", "255.255.255.248"));
    arrayEquals(["1.2.3.0", "1.2.3.15"], cidrIpSlashMask("1.2.3.4", "255.255.255.240"));
    arrayEquals(["1.2.3.0", "1.2.3.31"], cidrIpSlashMask("1.2.3.4", "255.255.255.224"));
    arrayEquals(["1.2.3.0", "1.2.3.63"], cidrIpSlashMask("1.2.3.4", "255.255.255.192"));
    arrayEquals(["1.2.3.0", "1.2.3.127"], cidrIpSlashMask("1.2.3.4", "255.255.255.128"));
    arrayEquals(["1.2.3.0", "1.2.3.255"], cidrIpSlashMask("1.2.3.4", "255.255.255.0"));
    arrayEquals(["1.2.2.0", "1.2.3.255"], cidrIpSlashMask("1.2.3.4", "255.255.254.0"));
    arrayEquals(["1.2.0.0", "1.2.3.255"], cidrIpSlashMask("1.2.3.4", "255.255.252.0"));

    return api;

    function isValidIp(ip) {
        return /^(?!\.)(\.?[0-9]{1,3}){4}$/.test(ip);
    }

    function cidrIpSlashBits(ip, bits) {
        return cidrCalc(
            ip42int(ip),
            bits2mask(bits)
        );
    }

    function cidrIpSlashMask(ip, mask) {
        return cidrCalc(
            ip42int(ip),
            ip42int(mask)
        );
    }

    function ip42int(ip) {
        var ipParts = ip.split('.');
        return ipParts[3] & 0xff |
            (ipParts[2] & 0xff) << 8 |
            (ipParts[1] & 0xff) << 16 |
            (ipParts[0] & 0xff) << 24;
    }

    function bits2mask(maskBits) {
        return 0xffffffff << (32 - maskBits);
    }

    /**
     * @param {number} ip
     * @param {number}  mask
     * @returns {[string,string]}
     */
    function cidrCalc(ip, mask) {
        return [int2ip4(ip & mask), int2ip4(ip | (~mask))];
    }

    function int2ip4(ip) {
        return [
            (ip >> 24) & 0xff, // or first mask, then >>> (0 shift)
            (ip >> 16) & 0xff,
            (ip >> 8) & 0xff,
            (ip & 0xff)
        ].join(".");
    }

    /**
     *
     * @param {Array} expected
     * @param {Array} actual
     */
    function arrayEquals(expected, actual) {
        var result = false;
        if (expected.length === actual.length) {
            result = expected.reduce(function (result, value, index) {
                return result && (value === actual[index]);
            }, true);
        }

        if (!result) {
            console.error("arrays not equal: ", expected, actual);
        }
    }
}());
